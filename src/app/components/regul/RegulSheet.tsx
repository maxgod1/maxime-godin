"use client";

import { BackspaceIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { lockRegul, unlockRegul } from "../../../actions/regulAuth";
import { cn } from "../../../utils/utils";
import {
  buildRows,
  formatClock,
  formatCompteur,
  formatInterval,
  formatKmPrecise,
  parseIntervalThousandths,
  formatMilli,
  formatMilliDisplay,
  normalizeEndKm,
  parseMilli,
  removeSegment,
  secondsPerKmDisplay,
  segmentBounds,
  splitSegment,
  stepInput,
  stepKm,
  type RegulRow,
  type SegmentBound,
  type SpeedSegment,
} from "../../../utils/regul-times";

const MOYENNE_KEY = "regul-moyenne";
const SEGMENTS_KEY = "regul-segments";

const DEFAULT_SEGMENTS: SpeedSegment[] = [{ id: "seg-0", endKm: "", speed: "76" }];

export default function RegulSheet({ initialUnlocked }: { initialUnlocked: boolean }) {
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [segments, setSegments] = useState<SpeedSegment[]>(DEFAULT_SEGMENTS);
  const [marked, setMarked] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SEGMENTS_KEY);
    const stored = saved ? parseStoredSegments(saved) : null;
    if (stored) {
      setSegments(stored);
    } else {
      const savedMoyenne = localStorage.getItem(MOYENNE_KEY);
      if (savedMoyenne) setSegments([{ id: "seg-0", endKm: "", speed: savedMoyenne }]);
    }
    localStorage.removeItem("regul-coef");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SEGMENTS_KEY, JSON.stringify(segments));
    if (segments.length === 1) localStorage.setItem(MOYENNE_KEY, segments[0].speed);
  }, [hydrated, segments]);

  if (!unlocked) {
    return (
      <LockScreen
        onUnlock={async (code) => {
          const result = await unlockRegul(code);
          if (result.ok) setUnlocked(true);
          return result.ok;
        }}
      />
    );
  }

  return (
    <Sheet
      segments={segments}
      marked={marked}
      onSegments={setSegments}
      onMark={setMarked}
      onLock={async () => {
        await lockRegul();
        setUnlocked(false);
      }}
    />
  );
}

function parseStoredSegments(raw: string): SpeedSegment[] | null {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data) || data.length === 0) return null;

    const segments: SpeedSegment[] = [];
    for (const item of data) {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      if (typeof record.id !== "string" || typeof record.speed !== "string") return null;
      segments.push({
        id: record.id,
        endKm: typeof record.endKm === "string" ? record.endKm : "",
        speed: record.speed,
      });
    }

    const last = segments.length - 1;
    segments[last] = { ...segments[last], endKm: "" };
    return segments;
  } catch {
    return null;
  }
}

function createSegmentId(): string {
  return `seg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const STEP_KEY = "regul-step";
const INTERVAL_KEY = "regul-interval";
const INTERVAL_PRESETS = [
  { thousandths: 1000, label: "1 km" },
  { thousandths: 500, label: "500 m" },
  { thousandths: 200, label: "200 m" },
  { thousandths: 100, label: "100 m" },
];
const STEP_CHOICES = [0.01, 0.1, 1] as const;

function formatStep(step: number): string {
  if (step === 0.01) return "0,01";
  if (step === 0.1) return "0,1";
  return "1";
}

function isUnfinishedDecimal(raw: string): boolean {
  const trimmed = raw.trim();
  return trimmed === "" || /[.,]$/.test(trimmed);
}

function LockScreen({ onUnlock }: { onUnlock: (code: string) => Promise<boolean> }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const codeRef = useRef("");
  const pendingRef = useRef(false);

  function pushDigit(digit: string) {
    if (pendingRef.current) return;
    const next = `${codeRef.current}${digit}`.slice(0, 4);
    codeRef.current = next;
    setCode(next);
    setError(false);
    if (next.length < 4) return;

    pendingRef.current = true;
    setPending(true);
    void onUnlock(next).then((ok) => {
      pendingRef.current = false;
      setPending(false);
      if (!ok) {
        setError(true);
        codeRef.current = "";
        setCode("");
      }
    });
  }

  function backspace() {
    if (pendingRef.current) return;
    const next = codeRef.current.slice(0, -1);
    codeRef.current = next;
    setCode(next);
    setError(false);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        pushDigit(event.key);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-slate-900">
      <h1 className="text-2xl font-bold tracking-tight">Moyennes</h1>
      <div className="mt-6 flex gap-3" aria-label="Code">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              "h-3.5 w-3.5 rounded-full",
              index < code.length ? "bg-slate-900" : "border-2 border-slate-300 bg-white"
            )}
          />
        ))}
      </div>
      <p className="mt-3 h-5 text-sm font-medium text-red-600" aria-live="polite">
        {error ? "Code incorrect" : ""}
      </p>
      <div className="mt-2 grid w-full max-w-[280px] grid-cols-3 gap-3">
        {digits.map((digit) => (
          <KeypadButton key={digit} onClick={() => pushDigit(digit)} disabled={pending}>
            {digit}
          </KeypadButton>
        ))}
        <span />
        <KeypadButton onClick={() => pushDigit("0")} disabled={pending}>
          0
        </KeypadButton>
        <KeypadButton onClick={backspace} disabled={pending} label="Effacer">
          <BackspaceIcon className="mx-auto h-7 w-7" />
        </KeypadButton>
      </div>
    </div>
  );
}

function KeypadButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="h-16 rounded-2xl bg-slate-100 text-2xl font-semibold text-slate-900 touch-manipulation active:bg-slate-300 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Sheet({
  segments,
  marked,
  onSegments,
  onMark,
  onLock,
}: {
  segments: SpeedSegment[];
  marked: number | null;
  onSegments: (segments: SpeedSegment[]) => void;
  onMark: (hundredths: number) => void;
  onLock: () => void;
}) {
  const [endDrafts, setEndDrafts] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [intervalOpen, setIntervalOpen] = useState(false);
  const [step, setStep] = useState(0.1);
  const [interval, setIntervalThousandths] = useState(200);
  const segmentsRef = useRef(segments);
  const endTimer = useRef<Record<string, number>>({});
  const endLatest = useRef<Record<string, string>>({});
  segmentsRef.current = segments;
  const bounds = useMemo(() => segmentBounds(segments), [segments]);
  const rows = useMemo(() => buildRows(segments, interval), [segments, interval]);
  const single = segments.length === 1;
  const singleSpeed = single ? parseMilli(segments[0].speed) : null;
  const perKm = singleSpeed !== null ? secondsPerKmDisplay(singleSpeed) : null;

  useEffect(() => {
    const saved = localStorage.getItem(STEP_KEY);
    if (saved === "0.01" || saved === "0.1" || saved === "1") setStep(Number(saved));
    const savedInterval = Number(localStorage.getItem(INTERVAL_KEY));
    if (Number.isInteger(savedInterval) && parseIntervalThousandths(`${savedInterval} m`)) {
      setIntervalThousandths(savedInterval);
    }
    return () => {
      Object.values(endTimer.current).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function chooseInterval(next: number) {
    setIntervalThousandths(next);
    localStorage.setItem(INTERVAL_KEY, String(next));
  }

  function chooseStep(next: number) {
    setStep(next);
    localStorage.setItem(STEP_KEY, String(next));
  }

  function writeSegments(next: SpeedSegment[]) {
    segmentsRef.current = next;
    onSegments(next);
  }

  function setSpeed(id: string, speed: string) {
    writeSegments(segmentsRef.current.map((segment) => (segment.id === id ? { ...segment, speed } : segment)));
  }

  function bumpSpeed(id: string, delta: number) {
    const segment = segmentsRef.current.find((item) => item.id === id);
    if (!segment) return;
    setSpeed(id, stepInput(segment.speed, delta, 76));
  }

  function clearDraft(id: string) {
    delete endLatest.current[id];
    setEndDrafts((drafts) => {
      if (!(id in drafts)) return drafts;
      const next = { ...drafts };
      delete next[id];
      return next;
    });
  }

  function commitEnd(id: string, raw: string) {
    window.clearTimeout(endTimer.current[id]);
    delete endTimer.current[id];
    const current = segmentsRef.current;
    const bound = segmentBounds(current).find((item) => item.id === id);
    const segment = current.find((item) => item.id === id);
    clearDraft(id);
    if (!bound || !segment || bound.startThousandths < 0 || bound.maxEndThousandths === null) return;
    const normalized = normalizeEndKm(raw, bound.startThousandths, bound.maxEndThousandths);
    if (!normalized || normalized === segment.endKm) return;
    writeSegments(current.map((item) => (item.id === id ? { ...item, endKm: normalized } : item)));
  }

  function editEnd(id: string, raw: string) {
    endLatest.current[id] = raw;
    setEndDrafts((drafts) => ({ ...drafts, [id]: raw }));
    window.clearTimeout(endTimer.current[id]);
    if (isUnfinishedDecimal(raw)) return;
    endTimer.current[id] = window.setTimeout(() => {
      if (endLatest.current[id] !== raw) return;
      commitEnd(id, raw);
    }, 650);
  }

  function stepEnd(id: string, delta: number) {
    window.clearTimeout(endTimer.current[id]);
    delete endTimer.current[id];
    const current = segmentsRef.current;
    const bound = segmentBounds(current).find((item) => item.id === id);
    const segment = current.find((item) => item.id === id);
    if (!bound || !segment || bound.startThousandths < 0 || bound.maxEndThousandths === null) return;
    const next = stepKm(endLatest.current[id] ?? segment.endKm, delta, bound.startThousandths, bound.maxEndThousandths);
    clearDraft(id);
    if (next === segment.endKm) return;
    writeSegments(current.map((item) => (item.id === id ? { ...item, endKm: next } : item)));
  }

  function insertAfter(id: string) {
    const newId = createSegmentId();
    writeSegments(splitSegment(segmentsRef.current, id, newId));
    setOpenId(newId);
  }

  function toggleBand(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  function remove(id: string) {
    window.clearTimeout(endTimer.current[id]);
    delete endTimer.current[id];
    clearDraft(id);
    writeSegments(removeSegment(segmentsRef.current, id));
  }

  function closeEditor() {
    for (const [id, raw] of Object.entries(endLatest.current)) commitEnd(id, raw);
    setEditorOpen(false);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-slate-900">
      <div className="shrink-0 border-b border-slate-200 bg-white px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold leading-none">Moyennes</h1>
            {single ? (
              <>
                <p className="mt-1 text-sm font-semibold tabular-nums text-slate-600">
                  {singleSpeed === null ? "—" : formatMilliDisplay(singleSpeed)} km/h
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums leading-none">
                  {perKm ?? "—"}
                  <span className="ml-1 text-sm font-semibold text-slate-500">s/km</span>
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm font-semibold text-slate-600">{segments.length} tronçons</p>
            )}
          </div>
          <button
            type="button"
            onClick={onLock}
            aria-label="Verrouiller"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 touch-manipulation active:bg-slate-200"
          >
            <LockClosedIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto mt-3 w-full max-w-5xl space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-12 min-w-0 flex-1 items-center justify-between gap-3 rounded-xl bg-slate-100 px-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entre les temps</span>
              <span className="text-base font-semibold tabular-nums text-slate-900">{formatInterval(interval)}</span>
            </div>
            <button
              type="button"
              onClick={() => setIntervalOpen(true)}
              aria-label="Modifier l'intervalle entre les temps"
              className="h-12 shrink-0 rounded-xl bg-slate-900 px-3.5 text-sm font-semibold text-white touch-manipulation active:bg-slate-700"
            >
              Modifier
            </button>
          </div>
          <RangeStrip bounds={bounds} onEdit={() => setEditorOpen(true)} />
        </div>
      </div>

      <EditorDialog open={intervalOpen} title="Entre les temps" titleId="regul-interval-title" onClose={() => setIntervalOpen(false)}>
        <IntervalControl value={interval} onChange={chooseInterval} />
      </EditorDialog>

      <EditorDialog open={editorOpen} title="Tronçons" titleId="regul-ranges-title" tall onClose={closeEditor}>
        <StepSize step={step} onChange={chooseStep} />
        <RangeTimeline
          bounds={bounds}
          segments={segments}
          drafts={endDrafts}
          step={step}
          openId={segments.length === 1 ? segments[0].id : openId}
          canRemove={segments.length > 1}
          onSpeed={setSpeed}
          onBumpSpeed={bumpSpeed}
          onDraft={editEnd}
          onCommit={commitEnd}
          onStepEnd={stepEnd}
          onInsert={insertAfter}
          onRemove={remove}
          onToggle={toggleBand}
        />
      </EditorDialog>

      <div className="min-h-0 flex-1 overflow-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-5xl">
          <TimeTable rows={rows} marked={marked} interval={interval} onMark={onMark} />
        </div>
      </div>
    </div>
  );
}

const RAIL = "3.75rem";

function RangeStrip({ bounds, onEdit }: { bounds: SegmentBound[]; onEdit: () => void }) {
  const closing = bounds[bounds.length - 1]?.endThousandths ?? -1;

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain">
        <div className="flex w-max min-w-full px-4 pb-1">
          {bounds.map((bound) => (
            <div
              key={bound.id}
              className={cn("relative flex-1 pt-5", bounds.length > 4 ? "min-w-[5.5rem]" : "min-w-0")}
            >
              <span className="absolute left-0 top-0 -translate-x-1/2 text-[11px] font-semibold tabular-nums leading-none text-slate-700">
                {kmTick(bound.startThousandths)}
              </span>
              <span aria-hidden className="absolute left-0 top-3.5 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-slate-900" />
              <span aria-hidden className={cn("absolute left-0 right-0 top-4 h-0.5", zoneRail(bound.index))} />
              {bound.isLast ? (
                <>
                  <span className="absolute right-0 top-0 translate-x-1/2 text-[11px] font-semibold tabular-nums leading-none text-slate-700">
                    {kmTick(closing)}
                  </span>
                  <span aria-hidden className="absolute right-0 top-3.5 z-10 h-2.5 w-2.5 translate-x-1/2 rounded-full border-2 border-white bg-slate-900" />
                </>
              ) : null}
              <p className="px-1 pt-3 text-center text-sm font-semibold tabular-nums leading-tight text-slate-900">
                {bound.speedMilli === null ? bound.speed || "—" : formatMilli(bound.speedMilli)}
                <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">
                  {bound.perKm ?? "—"} s/km
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Modifier les tronçons"
        className="h-12 shrink-0 rounded-xl bg-slate-900 px-3.5 text-sm font-semibold text-white touch-manipulation active:bg-slate-700"
      >
        Modifier
      </button>
    </div>
  );
}

function kmTick(thousandths: number): string {
  return thousandths < 0 ? "—" : formatKmPrecise(thousandths);
}

function EditorDialog({
  open,
  title,
  titleId,
  tall = false,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  titleId: string;
  tall?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className={cn(
        "m-auto w-full max-w-lg border-0 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/50 open:flex open:flex-col",
        tall ? "h-[100dvh] max-h-[100dvh]" : "h-fit max-h-[100dvh]"
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 id={titleId} className="text-lg font-bold leading-none">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white touch-manipulation active:bg-slate-700"
        >
          Fermer
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        {children}
      </div>
    </dialog>
  );
}

function RangeTimeline({
  bounds,
  segments,
  drafts,
  step,
  openId,
  canRemove,
  onSpeed,
  onBumpSpeed,
  onDraft,
  onCommit,
  onStepEnd,
  onInsert,
  onRemove,
  onToggle,
}: {
  bounds: SegmentBound[];
  segments: SpeedSegment[];
  drafts: Record<string, string>;
  step: number;
  openId: string | null;
  canRemove: boolean;
  onSpeed: (id: string, speed: string) => void;
  onBumpSpeed: (id: string, delta: number) => void;
  onDraft: (id: string, value: string) => void;
  onCommit: (id: string, raw: string) => void;
  onStepEnd: (id: string, delta: number) => void;
  onInsert: (id: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const closing = bounds[bounds.length - 1]?.endThousandths ?? -1;

  return (
    <div className="mt-3">
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute bottom-2.5 top-2.5 w-px -translate-x-1/2 bg-slate-300" style={{ left: RAIL }} />
        {bounds.map((bound) => (
          <Fragment key={bound.id}>
            <KmMark thousandths={bound.startThousandths} unit={bound.index === 0} />
            <div className="grid grid-cols-[3.75rem_minmax(0,1fr)]">
              <div />
              <div className="py-1.5 pl-3">
                {openId === bound.id ? (
                  <SegmentCard
                    bound={bound}
                    segment={segments[bound.index]}
                    draft={drafts[bound.id]}
                    step={step}
                    canRemove={canRemove}
                    collapsible={bounds.length > 1}
                    onSpeed={onSpeed}
                    onBumpSpeed={(delta) => onBumpSpeed(bound.id, delta)}
                    onDraft={(value) => onDraft(bound.id, value)}
                    onCommit={(raw) => onCommit(bound.id, raw)}
                    onStep={(delta) => onStepEnd(bound.id, delta)}
                    onInsert={() => onInsert(bound.id)}
                    onRemove={() => onRemove(bound.id)}
                    onClose={() => onToggle(bound.id)}
                  />
                ) : (
                  <button
                    type="button"
                    aria-expanded={false}
                    aria-label={bandLabel(bound)}
                    onClick={() => onToggle(bound.id)}
                    className={cn(
                      "flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 border-l-4 bg-slate-50 px-3 text-left touch-manipulation active:bg-slate-100",
                      zoneBorder(bound.index)
                    )}
                  >
                    <span className="text-lg font-semibold tabular-nums text-slate-900">
                      {bound.speedMilli === null ? bound.speed || "—" : formatMilli(bound.speedMilli)}
                      <span className="ml-1 text-sm font-semibold text-slate-500">km/h</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-slate-600">
                      {bound.perKm ?? "—"}
                      <span className="ml-1 text-slate-400">s/km</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </Fragment>
        ))}
        <KmMark thousandths={closing} />
      </div>
      <button
        type="button"
        onClick={() => onInsert(bounds[bounds.length - 1]?.id ?? "")}
        disabled={!bounds[bounds.length - 1]?.canSplit}
        className="mt-2 h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white touch-manipulation active:bg-slate-700 disabled:opacity-40"
      >
        Ajouter un tronçon
      </button>
    </div>
  );
}

function bandLabel(bound: SegmentBound): string {
  const from = bound.startThousandths < 0 ? null : formatKmPrecise(bound.startThousandths);
  const to = bound.endThousandths === null ? null : formatKmPrecise(bound.endThousandths);
  if (from === null || to === null) return "Tronçon";
  return `Tronçon de ${from} à ${to} km`;
}

function KmMark({ thousandths, unit = false }: { thousandths: number; unit?: boolean }) {
  const label = thousandths < 0 ? "—" : formatKmPrecise(thousandths);

  return (
    <div className="relative grid h-6 grid-cols-[3.75rem_minmax(0,1fr)] items-center">
      <span className="pr-3 text-right text-xs font-semibold tabular-nums text-slate-800">{label}</span>
      <span aria-hidden className="absolute top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-900" style={{ left: RAIL }} />
      {unit ? <span className="pl-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">km</span> : <span />}
    </div>
  );
}

function IntervalControl({ value, onChange }: { value: number; onChange: (thousandths: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? formatInterval(value);
  const invalid = draft !== null && draft.trim() !== "" && !/[.,]$/.test(draft.trim()) && parseIntervalThousandths(draft) === null;

  return (
    <div>
      <div className="grid grid-cols-4 gap-1" role="group" aria-label="Intervalle entre les temps">
        {INTERVAL_PRESETS.map((preset) => {
          const selected = draft === null && value === preset.thousandths;
          return (
            <button
              key={preset.thousandths}
              type="button"
              aria-pressed={selected}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setDraft(null);
                onChange(preset.thousandths);
              }}
              className={cn(
                "h-11 rounded-xl text-sm font-semibold tabular-nums touch-manipulation",
                selected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 active:bg-slate-200"
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <input
        id="interval"
        value={shown}
        onFocus={() => setDraft(formatInterval(value))}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          if (/km|m/i.test(raw)) {
            const parsed = parseIntervalThousandths(raw);
            if (parsed !== null) onChange(parsed);
          }
        }}
        onBlur={() => {
          if (draft !== null) {
            const parsed = parseIntervalThousandths(draft);
            if (parsed !== null) onChange(parsed);
          }
          setDraft(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
        inputMode="decimal"
        enterKeyHint="done"
        autoComplete="off"
        placeholder="250 m ou 1 km"
        aria-label="Intervalle entre les temps"
        className={cn(
          "mt-1.5 h-12 w-full rounded-xl border bg-white px-3 text-center text-lg font-semibold tabular-nums text-slate-900 outline-none",
          invalid ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-slate-900"
        )}
      />
    </div>
  );
}

function StepSize({ step, onChange }: { step: number; onChange: (step: number) => void }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pas +/-</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="Pas des boutons plus et moins">
        {STEP_CHOICES.map((choice) => (
          <button
            key={choice}
            type="button"
            aria-pressed={step === choice}
            onClick={() => onChange(choice)}
            className={cn(
              "h-11 rounded-lg text-base font-semibold tabular-nums touch-manipulation",
              step === choice ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 active:bg-slate-200"
            )}
          >
            {formatStep(choice)}
          </button>
        ))}
      </div>
    </div>
  );
}

function SegmentCard({
  bound,
  segment,
  draft,
  step,
  canRemove,
  collapsible,
  onSpeed,
  onBumpSpeed,
  onDraft,
  onCommit,
  onStep,
  onInsert,
  onRemove,
  onClose,
}: {
  bound: SegmentBound;
  segment: SpeedSegment;
  draft: string | undefined;
  step: number;
  canRemove: boolean;
  collapsible: boolean;
  onSpeed: (id: string, speed: string) => void;
  onBumpSpeed: (delta: number) => void;
  onDraft: (value: string) => void;
  onCommit: (raw: string) => void;
  onStep: (delta: number) => void;
  onInsert: () => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const draftInvalid =
    draft !== undefined &&
    draft.trim() !== "" &&
    !draft.trim().endsWith(".") &&
    (bound.startThousandths < 0 ||
      bound.maxEndThousandths === null ||
      normalizeEndKm(draft, bound.startThousandths, bound.maxEndThousandths) === null);

  const showInsert = !bound.isLast && bound.canSplit;

  return (
    <div className={cn("rounded-2xl border border-slate-200 border-l-4 bg-slate-50 p-2.5", zoneBorder(bound.index))}>
      {showInsert || canRemove || collapsible ? (
        <div className="mb-2 flex items-center justify-end gap-1.5">
          {collapsible ? (
            <button
              type="button"
              onClick={onClose}
              className="mr-auto h-10 rounded-xl px-2 text-sm font-semibold text-slate-500 touch-manipulation active:text-slate-800"
            >
              Fermer
            </button>
          ) : null}
          {showInsert ? (
            <button
              type="button"
              onClick={onInsert}
              className="h-10 rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 touch-manipulation active:bg-slate-100"
            >
              Insérer
            </button>
          ) : null}
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              aria-label="Retirer le tronçon"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 touch-manipulation active:bg-slate-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      ) : null}

      {!bound.isLast ? (
        <Stepper
          id={`end-${bound.id}`}
          label="Jusqu'à km"
          value={draft ?? segment.endKm}
          step={step}
          invalid={draftInvalid}
          onChange={onDraft}
          onBlur={onCommit}
          onStep={onStep}
          decreaseLabel="Reculer la fin du tronçon"
          increaseLabel="Avancer la fin du tronçon"
        />
      ) : null}

      <div className={cn(!bound.isLast && "mt-3")}>
        <Stepper
          id={`speed-${bound.id}`}
          label="Moyenne km/h"
          value={segment.speed}
          step={step}
          invalid={bound.speedMilli === null}
          aside={
            <span className="text-sm font-bold tabular-nums text-slate-900">
              {bound.perKm ?? "—"}
              <span className="ml-1 font-semibold text-slate-500">s/km</span>
            </span>
          }
          onChange={(value) => onSpeed(bound.id, value)}
          onStep={onBumpSpeed}
          decreaseLabel="Diminuer la moyenne"
          increaseLabel="Augmenter la moyenne"
        />
      </div>
    </div>
  );
}

function Stepper({
  id,
  label,
  value,
  onChange,
  onBlur,
  onStep,
  decreaseLabel,
  increaseLabel,
  aside,
  invalid = false,
  step = 0.1,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  onStep: (delta: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  aside?: React.ReactNode;
  invalid?: boolean;
  step?: number;
}) {
  const stepRef = useRef(step);
  const onStepRef = useRef(onStep);
  const repeat = useRef<number | null>(null);
  const delay = useRef<number | null>(null);
  const fromPointer = useRef(false);
  stepRef.current = step;
  onStepRef.current = onStep;

  function stopHold() {
    if (delay.current !== null) window.clearTimeout(delay.current);
    if (repeat.current !== null) window.clearInterval(repeat.current);
    delay.current = null;
    repeat.current = null;
  }

  function nudge(direction: -1 | 1) {
    onStepRef.current(direction * stepRef.current);
  }

  function startHold(direction: -1 | 1) {
    stopHold();
    nudge(direction);
    delay.current = window.setTimeout(() => {
      repeat.current = window.setInterval(() => nudge(direction), 90);
    }, 380);
  }

  useEffect(() => stopHold, []);

  const amount = formatStep(step);

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
        {aside}
      </div>
      <div className="flex items-center gap-2">
        <StepButton
          label={`${decreaseLabel} de ${amount}`}
          onTap={() => nudge(-1)}
          onHoldStart={() => startHold(-1)}
          onHoldEnd={stopHold}
          fromPointer={fromPointer}
        >
          −
        </StepButton>
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={(event) => {
            if (onBlur) onBlur(event.currentTarget.value);
            else onChange(value.replace(",", ".").trim());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
          inputMode="decimal"
          enterKeyHint="done"
          autoComplete="off"
          className={cn(
            "h-14 min-w-0 flex-1 rounded-xl border bg-white px-3 text-center text-2xl font-semibold tabular-nums text-slate-900 outline-none",
            invalid ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-slate-900"
          )}
        />
        <StepButton
          label={`${increaseLabel} de ${amount}`}
          onTap={() => nudge(1)}
          onHoldStart={() => startHold(1)}
          onHoldEnd={stopHold}
          fromPointer={fromPointer}
        >
          +
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  label,
  onTap,
  onHoldStart,
  onHoldEnd,
  fromPointer,
  children,
}: {
  label: string;
  onTap: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  fromPointer: React.MutableRefObject<boolean>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer.current = true;
        onHoldStart();
      }}
      onPointerUp={onHoldEnd}
      onPointerCancel={onHoldEnd}
      onLostPointerCapture={onHoldEnd}
      onContextMenu={(event) => event.preventDefault()}
      onClick={() => {
        if (fromPointer.current) {
          fromPointer.current = false;
          return;
        }
        onTap();
      }}
      className="h-14 w-14 shrink-0 rounded-xl bg-slate-100 text-2xl font-semibold touch-none select-none active:bg-slate-200"
    >
      {children}
    </button>
  );
}

const ZONE_BORDERS = ["border-l-sky-600", "border-l-violet-600", "border-l-emerald-600", "border-l-rose-600"];
const ZONE_RAILS = ["bg-sky-600", "bg-violet-600", "bg-emerald-600", "bg-rose-600"];

function zoneBorder(index: number): string {
  if (index < 0) return "border-l-transparent";
  return ZONE_BORDERS[index % ZONE_BORDERS.length];
}

function zoneRail(index: number): string {
  if (index < 0) return "bg-slate-300";
  return ZONE_RAILS[index % ZONE_RAILS.length];
}

function TimeTable({
  rows,
  marked,
  interval,
  onMark,
}: {
  rows: RegulRow[];
  marked: number | null;
  interval: number;
  onMark: (thousandths: number) => void;
}) {
  const zoned = rows.some((row) => row.banner);
  const gap = formatInterval(interval);

  return (
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">
        {zoned ? `Temps de régularité tous les ${gap}, par tronçons` : `Temps de régularité tous les ${gap}`}
      </caption>
      <thead className="sticky top-0 z-10 bg-slate-900 text-white">
        <tr>
          <th scope="col" className="w-[22%] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
            km
          </th>
          <th scope="col" className="w-[30%] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
            Compteur
          </th>
          <th scope="col" className="w-[48%] px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide">
            Temps
            <span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-white/70">h:m:s</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const wholeKm = row.thousandths % 1000 === 0;
          const fiveKm = row.thousandths % 5000 === 0;
          const active = marked === row.thousandths;

          return (
            <Fragment key={row.thousandths}>
              {row.banner ? (
                <tr className="bg-slate-900 text-white">
                  <td colSpan={3} className="px-3 py-2 text-sm font-semibold tabular-nums">
                    {row.banner}
                  </td>
                </tr>
              ) : null}
              <tr
                data-km={row.thousandths}
                data-zone={row.zoneIndex}
                onClick={() => onMark(row.thousandths)}
                className={cn(
                  "cursor-pointer border-b border-slate-200 border-l-4",
                  active
                    ? "border-l-amber-500 bg-amber-100"
                    : cn(
                        zoned ? zoneBorder(row.zoneIndex) : "border-l-transparent",
                        fiveKm ? "bg-slate-200" : wholeKm ? "bg-slate-100" : "bg-white"
                      )
                )}
              >
                <td className={cn("px-3 py-2.5 text-base tabular-nums", wholeKm && "font-bold")}>
                  {formatKmPrecise(row.thousandths)}
                </td>
                <td className="px-3 py-2.5 text-base tabular-nums text-slate-500">{formatCompteur(row.thousandths)}</td>
                <td className="px-3 py-2.5 text-right text-xl font-bold tabular-nums tracking-tight">
                  {row.seconds === null ? "—" : formatClock(row.seconds)}
                </td>
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

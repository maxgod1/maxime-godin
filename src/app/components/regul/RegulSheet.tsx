"use client";

import { BackspaceIcon, LockClosedIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../utils/utils";
import { RegulInstallHint, RegulIosHint, RegulOffline, useRegulInstall, type RegulInstallState } from "./RegulOffline";
import {
  checkRegulCode,
  getRegulInterval,
  getRegulSegments,
  getRegulStep,
  getRegulUnlocked,
  setRegulInterval,
  setRegulSegments,
  setRegulStep,
  setRegulUnlocked,
} from "./regul-store";
import {
  appendSegment,
  buildRows,
  insertSegment,
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
  stepInput,
  stepKm,
  type RegulRow,
  type SegmentBound,
  type SpeedSegment,
} from "../../../utils/regul-times";

const DEFAULT_SEGMENTS: SpeedSegment[] = [{ id: "seg-0", endKm: "50", speed: "76" }];

export default function RegulSheet({ initialUnlocked }: { initialUnlocked: boolean }) {
  const install = useRegulInstall();
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [segments, setSegments] = useState<SpeedSegment[]>(DEFAULT_SEGMENTS);
  const [marked, setMarked] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [storedUnlocked, storedSegments] = await Promise.all([getRegulUnlocked(), getRegulSegments()]);
      if (cancelled) return;
      const nextUnlocked = storedUnlocked ?? initialUnlocked;
      if (storedUnlocked === null) void setRegulUnlocked(nextUnlocked);
      if (storedSegments) setSegments(storedSegments);
      setUnlocked(nextUnlocked);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [initialUnlocked]);

  useEffect(() => {
    if (!ready) return;
    void setRegulSegments(segments);
  }, [ready, segments]);

  return (
    <>
      <RegulOffline />
      {!ready ? (
        <div className="h-full bg-white" />
      ) : !unlocked ? (
        <LockScreen
          install={install}
          onUnlock={async (code) => {
            if (!checkRegulCode(code)) return false;
            await setRegulUnlocked(true);
            setUnlocked(true);
            return true;
          }}
        />
      ) : (
        <Sheet
          install={install}
          segments={segments}
          marked={marked}
          onSegments={setSegments}
          onMark={setMarked}
          onLock={() => {
            void setRegulUnlocked(false);
            setUnlocked(false);
          }}
        />
      )}
    </>
  );
}

function createSegmentId(): string {
  return `seg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

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

function LockScreen({
  install,
  onUnlock,
}: {
  install: RegulInstallState;
  onUnlock: (code: string) => Promise<boolean>;
}) {
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
      <RegulInstallHint install={install} />
      <RegulIosHint install={install} />
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
  install,
  segments,
  marked,
  onSegments,
  onMark,
  onLock,
}: {
  install: RegulInstallState;
  segments: SpeedSegment[];
  marked: number | null;
  onSegments: (segments: SpeedSegment[]) => void;
  onMark: (hundredths: number) => void;
  onLock: () => void;
}) {
  const [endDrafts, setEndDrafts] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
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
    let cancelled = false;
    void (async () => {
      const [savedStep, savedInterval] = await Promise.all([getRegulStep(), getRegulInterval()]);
      if (cancelled) return;
      if (savedStep !== null) setStep(savedStep);
      if (savedInterval !== null && parseIntervalThousandths(`${savedInterval} m`)) setIntervalThousandths(savedInterval);
    })();
    return () => {
      cancelled = true;
      Object.values(endTimer.current).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function chooseInterval(next: number) {
    setIntervalThousandths(next);
    void setRegulInterval(next);
  }

  function chooseStep(next: number) {
    setStep(next);
    void setRegulStep(next);
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

    if (raw.trim() === "") {
      if (!bound.isLast || segment.endKm === "") return;
      writeSegments(current.map((item) => (item.id === id ? { ...item, endKm: "" } : item)));
      return;
    }

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
    if (!bound || !segment || bound.startThousandths < 0) return;
    const typed = endLatest.current[id];
    clearDraft(id);

    if (bound.maxEndThousandths === null) return;
    const next = stepKm(typed ?? segment.endKm, delta, bound.startThousandths, bound.maxEndThousandths);
    if (next === segment.endKm) return;
    writeSegments(current.map((item) => (item.id === id ? { ...item, endKm: next } : item)));
  }

  function appendAfter() {
    const newId = createSegmentId();
    const next = appendSegment(segmentsRef.current, newId);
    if (next === segmentsRef.current) return;
    writeSegments(next);
    setOpenId(newId);
  }

  function insertAfter(id: string) {
    const newId = createSegmentId();
    const next = insertSegment(segmentsRef.current, id, newId);
    if (next === segmentsRef.current) return;
    writeSegments(next);
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
    const active = document.activeElement;
    if (active instanceof HTMLElement) active.blur();
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
          <div className="flex items-center gap-2">
            <RegulInstallHint install={install} compact />
            <button
              type="button"
              onClick={onLock}
              aria-label="Verrouiller"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 touch-manipulation active:bg-slate-200"
            >
              <LockClosedIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <RegulIosHint install={install} className="mx-auto mt-2 w-full max-w-5xl text-sm font-medium leading-snug text-slate-600" />

        <div className="mx-auto mt-3 w-full max-w-5xl">
          <RangeStrip bounds={bounds} interval={interval} onEdit={() => setEditorOpen(true)} />
        </div>
      </div>

      <EditorDialog open={editorOpen} title="Moyennes" titleId="regul-ranges-title" tall onClose={closeEditor}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Entre les temps</p>
        <IntervalControl value={interval} onChange={chooseInterval} />
        <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Tronçons</p>
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
          onAppend={appendAfter}
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

function RangeStrip({
  bounds,
  interval,
  onEdit,
}: {
  bounds: SegmentBound[];
  interval: number;
  onEdit: () => void;
}) {
  const closing = bounds[bounds.length - 1]?.endThousandths ?? -1;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain">
        <div className="flex w-max min-w-full px-5 pb-1">
          <div className="relative mr-5 min-w-[6.5rem] flex-1 border-r border-slate-200 pr-4 pt-6 sm:mr-6 sm:max-w-[9rem] sm:min-w-0 sm:pr-5">
            <span className="absolute left-0 top-0 -translate-x-1/2 text-sm font-semibold tabular-nums leading-none text-slate-700 sm:text-[11px]">0</span>
            <span aria-hidden className="absolute left-0 top-[1.15rem] z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-slate-900 sm:top-3.5 sm:h-2.5 sm:w-2.5" />
            <span aria-hidden className="absolute left-0 right-4 top-6 h-1 bg-slate-300 sm:right-5 sm:top-4 sm:h-0.5" />
            <span className="absolute right-4 top-0 translate-x-1/2 text-sm font-semibold tabular-nums leading-none text-slate-700 sm:right-5 sm:text-[11px]">
              {kmTick(interval)}
            </span>
            <span aria-hidden className="absolute right-4 top-[1.15rem] z-10 h-3 w-3 translate-x-1/2 rounded-full border-2 border-white bg-slate-900 sm:right-5 sm:top-3.5 sm:h-2.5 sm:w-2.5" />
            <p className="px-1 pt-4 text-center text-xl font-semibold tabular-nums leading-tight text-slate-900 sm:pt-3 sm:text-sm">
              {formatInterval(interval)}
              <span className="mt-0.5 block text-sm font-semibold text-slate-500 sm:text-[11px]">entre les temps</span>
            </p>
          </div>
          {bounds.map((bound) => (
            <div
              key={bound.id}
              className={cn("relative flex-1 pt-6", bounds.length > 3 ? "min-w-[7rem]" : "min-w-[6.5rem] sm:min-w-0")}
            >
              <span className="absolute left-0 top-0 -translate-x-1/2 text-sm font-semibold tabular-nums leading-none text-slate-700 sm:text-[11px]">
                {kmTick(bound.startThousandths)}
              </span>
              <span aria-hidden className="absolute left-0 top-[1.15rem] z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-slate-900 sm:top-3.5 sm:h-2.5 sm:w-2.5" />
              <span aria-hidden className={cn("absolute left-0 right-0 top-6 h-1 sm:top-4 sm:h-0.5", zoneRail(bound.index))} />
              {bound.isLast && closing >= 0 ? (
                <>
                  <span className="absolute right-0 top-0 translate-x-1/2 text-sm font-semibold tabular-nums leading-none text-slate-700 sm:text-[11px]">
                    {kmTick(closing)}
                  </span>
                  <span aria-hidden className="absolute right-0 top-[1.15rem] z-10 h-3 w-3 translate-x-1/2 rounded-full border-2 border-white bg-slate-900 sm:top-3.5 sm:h-2.5 sm:w-2.5" />
                </>
              ) : null}
              <p className="px-1 pt-4 text-center text-xl font-semibold tabular-nums leading-tight text-slate-900 sm:pt-3 sm:text-sm">
                {bound.speedMilli === null ? bound.speed || "—" : formatMilli(bound.speedMilli)}
                <span className="mt-0.5 block text-sm font-semibold text-slate-500 sm:text-[11px]">
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
        aria-label="Modifier l'intervalle et les tronçons"
        className="h-14 w-full shrink-0 rounded-xl bg-slate-900 text-base font-semibold text-white touch-manipulation active:bg-slate-700 sm:h-12 sm:w-auto sm:px-3.5 sm:text-sm"
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
  onAppend,
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
  onAppend: () => void;
  onInsert: (id: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const closing = bounds[bounds.length - 1]?.endThousandths ?? -1;

  return (
    <div className="mt-3">
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute bottom-2.5 top-2.5 w-px -translate-x-1/2 bg-slate-300" style={{ left: RAIL }} />
        {bounds.map((bound) => {
          const segment = segments[bound.index];

          return (
          <Fragment key={bound.id}>
            <KmMark
              thousandths={bound.startThousandths}
              unit={bound.index === 0}
              plus={
                bound.index > 0 &&
                bound.startThousandths >= 0 &&
                bound.endThousandths !== null &&
                bound.endThousandths - bound.startThousandths >= 2
                  ? { label: "Insérer un tronçon", onClick: () => onInsert(bounds[bound.index - 1].id) }
                  : undefined
              }
            />
            <div className="grid grid-cols-[3.75rem_minmax(0,1fr)]">
              <div />
              <div className="py-1.5 pl-3">
                {openId === bound.id ? (
                  <SegmentCard
                    bound={bound}
                    segment={segment}
                    draft={drafts[bound.id]}
                    step={step}
                    canRemove={canRemove}
                    collapsible={bounds.length > 1}
                    onSpeed={onSpeed}
                    onBumpSpeed={(delta) => onBumpSpeed(bound.id, delta)}
                    onDraft={(value) => onDraft(bound.id, value)}
                    onCommit={(raw) => onCommit(bound.id, raw)}
                    onStep={(delta) => onStepEnd(bound.id, delta)}
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
                    <span className="text-base font-semibold tabular-nums text-slate-900">
                      {bandSpan(bound)}
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-slate-900">
                      {bound.speedMilli === null ? bound.speed || "—" : formatMilli(bound.speedMilli)}
                      <span className="ml-1 text-sm font-semibold text-slate-500">km/h</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </Fragment>
          );
        })}
        {closing >= 0 ? (
          <KmMark
            thousandths={closing}
            plus={{ label: "Ajouter un tronçon", onClick: onAppend }}
          />
        ) : null}
      </div>
    </div>
  );
}

function KmMark({
  thousandths,
  unit = false,
  plus,
}: {
  thousandths: number;
  unit?: boolean;
  plus?: { label: string; onClick: () => void };
}) {
  const label = thousandths < 0 ? "—" : formatKmPrecise(thousandths);

  return (
    <div className="relative grid h-10 grid-cols-[3.75rem_minmax(0,1fr)] items-center">
      <span className="pr-3 text-right text-xs font-semibold tabular-nums text-slate-800">{label}</span>
      <span aria-hidden className="absolute top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-900" style={{ left: RAIL }} />
      <span className="flex items-center gap-2 pl-3">
        {plus ? (
          <button
            type="button"
            aria-label={plus.label}
            onClick={plus.onClick}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-semibold leading-none text-slate-700 ring-1 ring-slate-300 touch-manipulation active:bg-slate-100"
          >
            +
          </button>
        ) : null}
        {unit ? <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">km</span> : null}
      </span>
    </div>
  );
}

function bandSpan(bound: SegmentBound): string {
  const from = bound.startThousandths < 0 ? null : formatKmPrecise(bound.startThousandths);
  const to = bound.endThousandths === null ? null : formatKmPrecise(bound.endThousandths);
  if (from === null) return "— km";
  if (to === null) return `Dès ${from} km`;
  return `${from}-${to} km`;
}

function bandLabel(bound: SegmentBound): string {
  const from = bound.startThousandths < 0 ? null : formatKmPrecise(bound.startThousandths);
  const to = bound.endThousandths === null ? null : formatKmPrecise(bound.endThousandths);
  if (from === null) return "Tronçon";
  if (to === null) return `Tronçon à partir de ${from} km`;
  return `Tronçon de ${from} à ${to} km`;
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
  onRemove: () => void;
  onClose: () => void;
}) {
  const fromLabel = bound.startThousandths < 0 ? "—" : formatKmPrecise(bound.startThousandths);
  const endMax = bound.maxEndThousandths;
  const draftInvalid =
    draft !== undefined &&
    draft.trim() !== "" &&
    !draft.trim().endsWith(".") &&
    (bound.startThousandths < 0 || endMax === null || normalizeEndKm(draft, bound.startThousandths, endMax) === null);

  return (
    <div className={cn("rounded-2xl border border-slate-200 border-l-4 bg-slate-50 p-2.5", zoneBorder(bound.index))}>
      {canRemove || collapsible ? (
        <div className="mb-2 flex items-center justify-end gap-1.5">
          {collapsible ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le tronçon"
              className="mr-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 touch-manipulation active:bg-slate-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          ) : null}
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              aria-label="Retirer le tronçon"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 touch-manipulation active:bg-slate-100"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      ) : null}

      <Stepper
        id={`end-${segment.id}`}
        label={`De ${fromLabel} à`}
        value={draft ?? segment.endKm}
        step={step}
        invalid={draftInvalid}
        aside={<span className="text-sm font-semibold text-slate-500">km</span>}
        onChange={onDraft}
        onBlur={onCommit}
        onStep={onStep}
        decreaseLabel="Reculer la fin du tronçon"
        increaseLabel="Avancer la fin du tronçon"
      />

      <div className="mt-3">
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
  placeholder,
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
  placeholder?: string;
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
          placeholder={placeholder}
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
          <th scope="col" className="w-[22%] px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-wide sm:py-2 sm:text-xs">
            km
          </th>
          <th scope="col" className="w-[28%] px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-wide sm:w-[30%] sm:py-2 sm:text-xs">
            Compteur
          </th>
          <th scope="col" className="w-[50%] px-3 py-2.5 text-right text-sm font-semibold uppercase tracking-wide sm:w-[48%] sm:py-2 sm:text-xs">
            Temps
            <span className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-white/70 sm:text-[10px]">h:m:s</span>
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
                  <td colSpan={3} className="px-3 py-2.5 text-base font-semibold tabular-nums sm:py-2 sm:text-sm">
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
                <td className={cn("px-3 py-3.5 text-xl tabular-nums sm:py-2.5 sm:text-base", wholeKm && "font-bold")}>
                  {formatKmPrecise(row.thousandths)}
                </td>
                <td className="px-3 py-3.5 text-lg tabular-nums text-slate-500 sm:py-2.5 sm:text-base">{formatCompteur(row.thousandths)}</td>
                <td className="px-3 py-3.5 text-right text-3xl font-bold tabular-nums tracking-tight sm:py-2.5 sm:text-xl">
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

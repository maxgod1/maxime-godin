"use client";

import { BackspaceIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";
import { lockRegul, unlockRegul } from "../../../actions/regulAuth";
import { cn } from "../../../utils/utils";
import {
  buildRows,
  formatClock,
  formatKm,
  formatMilliCompact,
  formatMilliDisplay,
  nearestHundredths,
  parseMilli,
  parsePositive,
  secondsPerKmDisplay,
  stepInput,
  type RegulRow,
} from "../../../utils/regul-times";

const MOYENNE_KEY = "regul-moyenne";
const COEF_KEY = "regul-coef";

export default function RegulSheet({ initialUnlocked }: { initialUnlocked: boolean; }) {
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [moyenne, setMoyenne] = useState("76");
  const [coef, setCoef] = useState("1");
  const [marked, setMarked] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedMoyenne = localStorage.getItem(MOYENNE_KEY);
    const savedCoef = localStorage.getItem(COEF_KEY);
    if (savedMoyenne) setMoyenne(savedMoyenne);
    if (savedCoef) setCoef(savedCoef);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(MOYENNE_KEY, moyenne);
    localStorage.setItem(COEF_KEY, coef);
  }, [hydrated, moyenne, coef]);

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
      moyenne={moyenne}
      coef={coef}
      marked={marked}
      onMoyenne={setMoyenne}
      onCoef={setCoef}
      onMark={setMarked}
      onLock={async () => {
        await lockRegul();
        setUnlocked(false);
      }}
    />
  );
}

function LockScreen({ onUnlock }: { onUnlock: (code: string) => Promise<boolean>; }) {
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
  moyenne,
  coef,
  marked,
  onMoyenne,
  onCoef,
  onMark,
  onLock,
}: {
  moyenne: string;
  coef: string;
  marked: number | null;
  onMoyenne: (value: string) => void;
  onCoef: (value: string) => void;
  onMark: (hundredths: number) => void;
  onLock: () => void;
}) {
  const [jump, setJump] = useState("");
  const avgMilli = parseMilli(moyenne);
  const coefMilli = parseMilli(coef);
  const perKm = avgMilli !== null && coefMilli !== null ? secondsPerKmDisplay(avgMilli, coefMilli) : null;
  const rows = useMemo(() => buildRows(avgMilli, coefMilli), [avgMilli, coefMilli]);

  function goToKm(event: React.FormEvent) {
    event.preventDefault();
    const target = parsePositive(jump);
    if (target === null) return;
    const hundredths = nearestHundredths(target);
    onMark(hundredths);
    const nodes = document.querySelectorAll<HTMLElement>(`[data-km="${hundredths}"]`);
    const visible = Array.from(nodes).find((node) => node.getClientRects().length > 0);
    visible?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-slate-900">
      <div className="shrink-0 border-b border-slate-200 bg-white px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold leading-none">Moyennes</h1>
            <p className="mt-1 text-sm font-semibold tabular-nums text-slate-600">
              {avgMilli === null ? "—" : formatMilliDisplay(avgMilli)} km/h
              <span className="mx-1.5 text-slate-300">·</span>
              coef {coefMilli === null ? "—" : formatMilliCompact(coefMilli)}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums leading-none">
              {perKm ?? "—"}
              <span className="ml-1 text-sm font-semibold text-slate-500">s/km</span>
            </p>
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

        <div className="mx-auto mt-3 grid w-full max-w-5xl grid-cols-2 gap-3">
          <Stepper
            id="moyenne"
            label="Moyenne km/h"
            value={moyenne}
            onChange={onMoyenne}
            onStep={(delta) => onMoyenne(stepInput(moyenne, delta, 76))}
            decreaseLabel="Diminuer la moyenne"
            increaseLabel="Augmenter la moyenne"
          />
          <Stepper
            id="coef"
            label="Coeff."
            value={coef}
            onChange={onCoef}
            onStep={(delta) => onCoef(stepInput(coef, delta, 1))}
            decreaseLabel="Diminuer le coefficient"
            increaseLabel="Augmenter le coefficient"
            step={0.01}
          />
        </div>


      </div>

      <div className="min-h-0 flex-1 overflow-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-5xl">
          <TimeTable rows={rows} marked={marked} onMark={onMark} />
        </div>
      </div>
    </div>
  );
}

function Stepper({
  id,
  label,
  value,
  onChange,
  onStep,
  decreaseLabel,
  increaseLabel,
  step = 1,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onStep: (delta: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  step?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={decreaseLabel}
          onClick={() => onStep(-step)}
          className="h-12 w-11 shrink-0 rounded-xl bg-slate-100 text-xl font-semibold touch-manipulation active:bg-slate-200"
        >
          −
        </button>
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => onChange(value.replace(",", ".").trim())}
          onFocus={(event) => event.currentTarget.select()}
          inputMode="decimal"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-2 text-center text-lg font-semibold tabular-nums text-slate-900 outline-none focus:border-slate-900"
        />
        <button
          type="button"
          aria-label={increaseLabel}
          onClick={() => onStep(step)}
          className="h-12 w-11 shrink-0 rounded-xl bg-slate-100 text-xl font-semibold touch-manipulation active:bg-slate-200"
        >
          +
        </button>
      </div>
    </div>
  );
}

function TimeTable({
  rows,
  marked,
  onMark,
}: {
  rows: RegulRow[];
  marked: number | null;
  onMark: (hundredths: number) => void;
}) {
  return (
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">Temps de régularité de 0,2 à 50 km</caption>
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
          const wholeKm = row.hundredths % 100 === 0;
          const fiveKm = row.hundredths % 500 === 0;
          const active = marked === row.hundredths;

          return (
            <tr
              key={row.hundredths}
              data-km={row.hundredths}
              onClick={() => onMark(row.hundredths)}
              className={cn(
                "cursor-pointer border-b border-slate-200 border-l-4",
                active
                  ? "border-l-amber-500 bg-amber-100"
                  : fiveKm
                    ? "border-l-transparent bg-slate-200"
                    : wholeKm
                      ? "border-l-transparent bg-slate-100"
                      : "border-l-transparent bg-white"
              )}
            >
              <td className={cn("px-3 py-2.5 text-base tabular-nums", wholeKm && "font-bold")}>{formatKm(row.km)}</td>
              <td className="px-3 py-2.5 text-base tabular-nums text-slate-500">{row.km.toFixed(2)}</td>
              <td className="px-3 py-2.5 text-right text-xl font-bold tabular-nums tracking-tight">
                {row.seconds === null ? "—" : formatClock(row.seconds)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

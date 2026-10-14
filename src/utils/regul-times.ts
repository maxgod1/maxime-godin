export const STEP_KM = 0.2;
export const MAX_KM = 50;

const STEP_COUNT = Math.round(MAX_KM / STEP_KM);
const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const HUNDRED = BigInt(100);
const THIRTY_SIX = BigInt(36);
const THREE_SIX_HUNDRED = BigInt(3600);
const SCALE = BigInt(1000);

export type RegulRow = {
  hundredths: number;
  km: number;
  seconds: number | null;
};

/** Fixed-point value in thousandths, e.g. 76 -> 76000, 1.01 -> 1010. */
export type Milli = bigint;

export function parsePositive(raw: string): number | null {
  const milli = parseMilli(raw);
  if (milli === null) return null;
  return Number(milli) / Number(SCALE);
}

export function parseMilli(raw: string): Milli | null {
  const cleaned = raw.replace(",", ".").trim();
  if (!cleaned || cleaned === "." || cleaned === "+" || cleaned === "-") return null;

  const match = cleaned.match(/^([+-]?)(\d*)(?:\.(\d*))?$/);
  if (!match) return null;

  const sign = match[1] === "-" ? -ONE : ONE;
  const whole = match[2] || "0";
  const fraction = (match[3] || "").slice(0, 3).padEnd(3, "0");
  const value = sign * (BigInt(whole) * SCALE + BigInt(fraction));
  if (value <= ZERO) return null;
  return value;
}

export function formatMilliDisplay(value: Milli, digits = 2): string {
  const negative = value < ZERO;
  const abs = negative ? -value : value;
  const whole = abs / SCALE;
  const fraction = (abs % SCALE).toString().padStart(3, "0").slice(0, digits);
  const sign = negative ? "-" : "";
  return `${sign}${whole}.${fraction.padEnd(digits, "0")}`;
}

export function formatMilliCompact(value: Milli): string {
  return formatMilli(value);
}

/** s/km displayed to 2 decimals, computed with integer rounding. */
export function secondsPerKmDisplay(avgMilli: Milli, coefMilli: Milli): string {
  // 3600 * coef / avg, then round to 0.01
  // = round(3600 * coefMilli * 100 / avgMilli) / 100
  const hundredths = divRound(THREE_SIX_HUNDRED * coefMilli * HUNDRED, avgMilli);
  const whole = hundredths / HUNDRED;
  const frac = (hundredths % HUNDRED).toString().padStart(2, "0");
  return `${whole}.${frac}`;
}

export function buildRows(avgMilli: Milli | null, coefMilli: Milli | null): RegulRow[] {
  const rows: RegulRow[] = [];

  for (let step = 1; step <= STEP_COUNT; step++) {
    const hundredths = step * 20;
    const km = hundredths / 100;
    rows.push({
      hundredths,
      km,
      seconds:
        avgMilli === null || coefMilli === null
          ? null
          : Number(secondsAtHundredths(BigInt(hundredths), avgMilli, coefMilli)),
    });
  }

  return rows;
}

/**
 * Exact regularity clock in whole seconds.
 * time = km * 3600 * coef / avg, with km = hundredths / 100
 * => seconds = round(hundredths * 36 * coef / avg)
 */
export function secondsAtHundredths(hundredths: bigint, avgMilli: Milli, coefMilli: Milli): bigint {
  return divRound(hundredths * THIRTY_SIX * coefMilli, avgMilli);
}

export function formatClock(totalSeconds: number | bigint): string {
  const seconds = typeof totalSeconds === "bigint" ? Number(totalSeconds) : Math.round(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.abs(seconds % 60);
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function formatKm(km: number): string {
  const tenths = Math.round(km * 10);
  if (tenths % 10 === 0) return String(tenths / 10);
  return (tenths / 10).toFixed(1);
}

export function nearestHundredths(km: number): number {
  const steps = Math.round(km / STEP_KM);
  const clamped = Math.min(STEP_COUNT, Math.max(1, steps));
  return clamped * 20;
}

export function stepInput(current: string, delta: number, fallback: number): string {
  const base = parseMilli(current) ?? toMilli(fallback);
  const nextMilli = base + toMilli(delta);
  if (nextMilli <= ZERO) return current;
  return formatMilli(nextMilli);
}

function toMilli(value: number): Milli {
  return BigInt(Math.round(value * Number(SCALE)));
}

function formatMilli(value: Milli): string {
  const negative = value < ZERO;
  const abs = negative ? -value : value;
  const whole = abs / SCALE;
  const fraction = abs % SCALE;
  const sign = negative ? "-" : "";
  if (fraction === ZERO) return `${sign}${whole}`;
  return `${sign}${whole}.${fraction.toString().padStart(3, "0").replace(/0+$/, "")}`;
}

/** Integer division rounded half away from zero. */
function divRound(numer: bigint, denom: bigint): bigint {
  if (denom === ZERO) throw new Error("Division by zero");
  if (numer >= ZERO === denom >= ZERO) {
    return (numer + denom / TWO) / denom;
  }
  return (numer - denom / TWO) / denom;
}

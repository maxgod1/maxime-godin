export const STEP_KM = 0.2;
/** Safety ceiling for a typed end. The sheet itself stops at the last end that was entered. */
export const MAX_KM = 999;

const STEP_COUNT = Math.round(MAX_KM / STEP_KM);
const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const HUNDRED = BigInt(100);
const THIRTY_SIX = BigInt(36);
const THREE_SIX_HUNDRED = BigInt(3600);
const SCALE = BigInt(1000);

export type RegulRow = {
  /** Distance from the start, in thousandths of a kilometer (1 = 1 m). */
  thousandths: number;
  km: number;
  seconds: number | null;
  /** -1 when this distance has no usable moyenne. */
  zoneIndex: number;
  /** Set on the first row that enters a new tronçon, when there is more than one. */
  banner: string | null;
};

/** One imposed average, from the previous end (or 0) up to endKm. An empty end stops the sheet. */
export type SpeedSegment = {
  id: string;
  endKm: string;
  speed: string;
};

export type ResolvedSegment = {
  startThousandths: number;
  endThousandths: number;
  speedMilli: Milli;
};

export type SegmentBound = {
  id: string;
  index: number;
  isLast: boolean;
  /** -1 when a previous boundary is invalid and this start is unknown. */
  startThousandths: number;
  endThousandths: number | null;
  /** Highest end still leaving the next tronçon at least 0.001 km. */
  maxEndThousandths: number | null;
  speed: string;
  speedMilli: Milli | null;
  perKm: string | null;
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

/** s/km displayed to 2 decimals, computed with integer rounding. */
export function secondsPerKmDisplay(avgMilli: Milli): string {
  // 3600 / avg, then round to 0.01
  // = round(3600 * SCALE * 100 / avgMilli) / 100
  const hundredths = divRound(THREE_SIX_HUNDRED * SCALE * HUNDRED, avgMilli);
  const whole = hundredths / HUNDRED;
  const frac = (hundredths % HUNDRED).toString().padStart(2, "0");
  return `${whole}.${frac}`;
}

const MAX_THOUSANDTHS = MAX_KM * Number(SCALE);
const TEN = BigInt(10);

/** Kilometers as thousandths (1 = 0.001 km). Three decimal places, same as the moyennes. */
export function parseKmThousandths(raw: string): number | null {
  const milli = parseMilli(raw);
  if (milli === null || milli > BigInt(MAX_THOUSANDTHS)) return null;
  return Number(milli);
}

export function formatKmPrecise(thousandths: number): string {
  return formatMilli(BigInt(Math.round(thousandths)));
}

export function segmentBounds(segments: SpeedSegment[]): SegmentBound[] {
  const bounds: SegmentBound[] = [];
  let cursor = 0;
  let blocked = false;

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const speedMilli = parseMilli(segment.speed);
    const startThousandths = blocked ? -1 : cursor;
    let endThousandths: number | null = null;

    if (!blocked) {
      const parsed = parseKmThousandths(segment.endKm);
      if (parsed !== null && parsed > cursor && parsed <= MAX_THOUSANDTHS) {
        endThousandths = parsed;
      }
    }

    bounds.push({
      id: segment.id,
      index,
      isLast,
      startThousandths,
      endThousandths,
      maxEndThousandths: null,
      speed: segment.speed,
      speedMilli,
      perKm: speedMilli ? secondsPerKmDisplay(speedMilli) : null,
    });

    if (blocked) return;
    if (endThousandths === null) {
      blocked = true;
      return;
    }
    cursor = endThousandths;
  });

  bounds.forEach((bound, index) => {
    const start = bound.startThousandths;
    if (start < 0) return;

    const nextEnd = bound.isLast ? null : bounds[index + 1]?.endThousandths;
    const ceiling = nextEnd === null || nextEnd === undefined ? MAX_THOUSANDTHS : nextEnd - 1;
    bound.maxEndThousandths = ceiling > start ? ceiling : null;
  });

  return bounds;
}

export function resolveSegments(segments: SpeedSegment[]): ResolvedSegment[] {
  const zones: ResolvedSegment[] = [];

  for (const bound of segmentBounds(segments)) {
    if (bound.startThousandths < 0 || bound.endThousandths === null || bound.speedMilli === null) break;
    if (bound.endThousandths <= bound.startThousandths) break;
    zones.push({
      startThousandths: bound.startThousandths,
      endThousandths: bound.endThousandths,
      speedMilli: bound.speedMilli,
    });
  }

  return zones;
}

/** Commit a typed end. Returns null when it is not strictly inside (min, max]. */
export function normalizeEndKm(raw: string, minExclusive: number, maxInclusive: number): string | null {
  const parsed = parseKmThousandths(raw);
  if (parsed === null || parsed <= minExclusive || parsed > maxInclusive) return null;
  return formatKmPrecise(parsed);
}

/** Step an end, staying inside (min, max]. An empty field starts from min. */
export function stepKm(current: string, deltaKm: number, minExclusive: number, maxInclusive: number): string {
  const base = parseKmThousandths(current);
  let origin = base === null ? minExclusive : base;
  if (origin > maxInclusive) origin = maxInclusive;
  if (origin < minExclusive) origin = minExclusive;

  let next = origin + Math.round(deltaKm * Number(SCALE));
  if (next <= minExclusive) return current;
  if (next > maxInclusive) next = maxInclusive;
  if (next <= minExclusive) return current;
  return formatKmPrecise(next);
}

/** Add the next tronçon after the last end. Its start is that end, and its own end is still blank. */
export function appendSegment(segments: SpeedSegment[], newId: string): SpeedSegment[] {
  const last = segmentBounds(segments).at(-1);
  if (!last || last.endThousandths === null || last.endThousandths >= MAX_THOUSANDTHS) return segments;
  const speed = segments[segments.length - 1]?.speed || "76";
  return [...segments, { id: newId, endKm: "", speed }];
}

/** A cut 5 km after the start, or the middle when the gap is shorter. */
function suggestCut(start: number, end: number): number | null {
  if (end - start < 2) return null;
  const preferred = start + 5000;
  if (preferred < end) return preferred;
  const mid = start + Math.floor((end - start) / 2);
  const rounded = Math.round(mid / 100) * 100;
  if (rounded > start && rounded < end) return rounded;
  if (mid > start && mid < end) return mid;
  return null;
}

/** Insert a tronçon after this one. It starts at this end and stops before the following end. */
export function insertSegment(segments: SpeedSegment[], afterId: string, newId: string): SpeedSegment[] {
  const bounds = segmentBounds(segments);
  const after = bounds.find((bound) => bound.id === afterId);
  if (!after || after.isLast || after.endThousandths === null) return segments;
  const next = bounds[after.index + 1];
  if (!next || next.endThousandths === null || next.startThousandths !== after.endThousandths) return segments;
  const cut = suggestCut(after.endThousandths, next.endThousandths);
  if (cut === null) return segments;
  const speed = segments[next.index]?.speed || "76";
  return [
    ...segments.slice(0, after.index + 1),
    { id: newId, endKm: formatKmPrecise(cut), speed },
    ...segments.slice(after.index + 1),
  ];
}

export function removeSegment(segments: SpeedSegment[], id: string): SpeedSegment[] {
  if (segments.length <= 1) return segments;
  return segments.filter((segment) => segment.id !== id);
}

export const DEFAULT_INTERVAL_THOUSANDTHS = 200;
const MIN_INTERVAL_THOUSANDTHS = 10;

/**
 * Gap between time rows.
 * "1", "1 km" and "0.5" are kilometers. "200", "500 m" and "1.5 km" too when the unit is written.
 * A bare number of 10 or more is meters, so 200 means 200 m and 1 means 1 km.
 */
export function parseIntervalThousandths(raw: string): number | null {
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (!cleaned || /[.,]$/.test(cleaned)) return null;

  const km = cleaned.match(/^(\d+(?:[.,]\d+)?)km$/);
  const meters = cleaned.match(/^(\d+(?:[.,]\d+)?)m$/);
  if (km) return clampInterval(Number(km[1].replace(",", ".")) * 1000);
  if (meters) return clampInterval(Number(meters[1].replace(",", ".")));

  const plain = Number(cleaned.replace(",", "."));
  if (!Number.isFinite(plain)) return null;
  return clampInterval(plain >= 10 ? plain : plain * 1000);
}

export function formatInterval(thousandths: number): string {
  if (thousandths % 1000 === 0) return `${thousandths / 1000} km`;
  if (thousandths > 1000 && thousandths % 100 === 0) return `${(thousandths / 1000).toFixed(1)} km`;
  return `${thousandths} m`;
}

export function formatCompteur(thousandths: number): string {
  const decimals = thousandths % 10 === 0 ? 2 : 3;
  return (thousandths / 1000).toFixed(decimals);
}

function clampInterval(thousandths: number): number | null {
  if (!Number.isFinite(thousandths)) return null;
  const rounded = Math.round(thousandths);
  if (rounded < MIN_INTERVAL_THOUSANDTHS || rounded > MAX_THOUSANDTHS) return null;
  return rounded;
}

export function buildRows(segments: SpeedSegment[], intervalThousandths = DEFAULT_INTERVAL_THOUSANDTHS): RegulRow[] {
  const interval = clampInterval(intervalThousandths) ?? DEFAULT_INTERVAL_THOUSANDTHS;
  const zones = resolveSegments(segments);
  const sheetEnd = zones.at(-1)?.endThousandths ?? 0;
  const rows: RegulRow[] = [];
  let previousZone = -1;

  for (let thousandths = interval; thousandths <= sheetEnd; thousandths += interval) {
    const km = thousandths / 1000;
    const zoneIndex = zoneAt(thousandths, zones);
    const seconds = zoneIndex < 0 ? null : Number(cumulativeSeconds(thousandths, zones));
    let banner: string | null = null;

    if (zones.length > 1 && zoneIndex > 0 && zoneIndex !== previousZone) {
      const zone = zones[zoneIndex];
      const previous = zones[zoneIndex - 1];
      if (zone.speedMilli !== previous.speedMilli) {
        banner = `Dès ${formatKmPrecise(zone.startThousandths)} km, ${formatMilli(zone.speedMilli)} km/h`;
      }
    }

    if (zoneIndex >= 0) previousZone = zoneIndex;

    rows.push({ thousandths, km, seconds, zoneIndex, banner });
  }

  return rows;
}

/**
 * Exact regularity clock in whole seconds.
 * time = km * 3600 / avg, with km = hundredths / 100
 * => seconds = round(hundredths * 36 * SCALE / avgMilli)
 */
export function secondsAtHundredths(hundredths: bigint, avgMilli: Milli): bigint {
  return divRound(hundredths * THIRTY_SIX * SCALE, avgMilli);
}

/**
 * Cumulative time across tronçons.
 * Each piece is km * 3600 / avg. The pieces are summed exactly, then rounded once,
 * so a single tronçon matches secondsAtHundredths.
 */
function cumulativeSeconds(thousandths: number, zones: ResolvedSegment[]): bigint {
  let numer = ZERO;
  let denom = ONE;

  for (const zone of zones) {
    if (thousandths <= zone.startThousandths) break;
    const end = thousandths < zone.endThousandths ? thousandths : zone.endThousandths;
    const delta = end - zone.startThousandths;
    if (delta <= 0) continue;

    const addN = BigInt(delta) * THIRTY_SIX * SCALE;
    const addD = TEN * zone.speedMilli;
    numer = numer * addD + addN * denom;
    denom = denom * addD;
    const divisor = gcd(numer, denom);
    numer /= divisor;
    denom /= divisor;

    if (thousandths <= zone.endThousandths) break;
  }

  return divRound(numer, denom);
}

function zoneAt(thousandths: number, zones: ResolvedSegment[]): number {
  for (let index = 0; index < zones.length; index++) {
    const zone = zones[index];
    if (thousandths <= zone.startThousandths) continue;
    if (thousandths < zone.endThousandths || thousandths === zone.endThousandths) return index;
  }
  return -1;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < ZERO ? -a : a;
  let y = b < ZERO ? -b : b;
  while (y !== ZERO) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === ZERO ? ONE : x;
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

export function formatMilli(value: Milli): string {
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

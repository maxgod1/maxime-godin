import type { SpeedSegment } from "../../../utils/regul-times";

const DB_NAME = "regul_offline_db";
const STORE_NAME = "regul_store";
const PASSWORD = "8315";

const LEGACY_SEGMENTS = "regul-segments";
const LEGACY_MOYENNE = "regul-moyenne";
const LEGACY_STEP = "regul-step";
const LEGACY_INTERVAL = "regul-interval";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readDb<T>(key: string): Promise<{ ok: true; value: T | undefined } | { ok: false }> {
  try {
    const database = await openDb();
    const value = await requestToPromise(database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key));
    return { ok: true, value: value as T | undefined };
  } catch {
    return { ok: false };
  }
}

async function writeDb<T>(key: string, value: T): Promise<boolean> {
  try {
    const database = await openDb();
    await requestToPromise(database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(value, key));
    return true;
  } catch {
    return false;
  }
}

function readFallback<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`regul-db:${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeFallback<T>(key: string, value: T) {
  localStorage.setItem(`regul-db:${key}`, JSON.stringify(value));
}

/** Older sheets stored a blank last end, which meant "continue to 50 km". Keep that length once, as a normal end. */
async function settleEnds(segments: SpeedSegment[]): Promise<SpeedSegment[]> {
  const stored = await readDb<boolean>("explicit-ends");
  const explicit = (stored.ok && stored.value === true) || readFallback<boolean>("explicit-ends") === true;
  if (explicit) return segments;

  const last = segments.length - 1;
  const next =
    segments[last]?.endKm.trim() === ""
      ? segments.map((segment, index) => (index === last ? { ...segment, endKm: "50" } : segment))
      : segments;
  await writeStored("segments", next);
  await writeStored("explicit-ends", true);
  return next;
}

async function readStored<T>(key: string, legacyKey: string | null, parseLegacy: ((raw: string) => T | null) | null): Promise<T | null> {
  const stored = await readDb<T>(key);
  if (stored.ok && stored.value !== undefined) return stored.value;

  if (legacyKey && parseLegacy) {
    const raw = localStorage.getItem(legacyKey);
    if (raw !== null) {
      const parsed = parseLegacy(raw);
      if (parsed !== null) {
        if (stored.ok) {
          await writeDb(key, parsed);
          localStorage.removeItem(legacyKey);
        }
        return parsed;
      }
    }
  }

  if (!stored.ok) return readFallback<T>(key);
  return null;
}

async function writeStored<T>(key: string, value: T) {
  const ok = await writeDb(key, value);
  if (ok) localStorage.removeItem(`regul-db:${key}`);
  else writeFallback(key, value);
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

    return segments;
  } catch {
    return null;
  }
}

export function checkRegulCode(code: string) {
  return code === PASSWORD;
}

export async function getRegulUnlocked(): Promise<boolean | null> {
  const value = await readStored<boolean>("unlocked", null, null);
  return typeof value === "boolean" ? value : null;
}

export async function setRegulUnlocked(unlocked: boolean) {
  await writeStored("unlocked", unlocked);
}

export async function getRegulSegments(): Promise<SpeedSegment[] | null> {
  const stored = await readStored<SpeedSegment[]>("segments", LEGACY_SEGMENTS, parseStoredSegments);
  if (stored) {
    localStorage.removeItem(LEGACY_MOYENNE);
    localStorage.removeItem("regul-coef");
    return settleEnds(stored);
  }

  const moyenne = localStorage.getItem(LEGACY_MOYENNE);
  if (!moyenne) {
    localStorage.removeItem("regul-coef");
    return null;
  }

  const segments: SpeedSegment[] = [{ id: "seg-0", endKm: "50", speed: moyenne }];
  await writeStored("segments", segments);
  await writeStored("explicit-ends", true);
  localStorage.removeItem(LEGACY_MOYENNE);
  localStorage.removeItem("regul-coef");
  return segments;
}

export async function setRegulSegments(segments: SpeedSegment[]) {
  await writeStored("segments", segments);
}

export async function getRegulStep(): Promise<number | null> {
  const value = await readStored<number | string>("step", LEGACY_STEP, (raw) => raw);
  const step = typeof value === "number" ? value : Number(value);
  if (step === 0.01 || step === 0.1 || step === 1) return step;
  return null;
}

export async function setRegulStep(step: number) {
  await writeStored("step", step);
}

export async function getRegulInterval(): Promise<number | null> {
  const value = await readStored<number | string>("interval", LEGACY_INTERVAL, (raw) => raw);
  const interval = typeof value === "number" ? value : Number(value);
  if (Number.isInteger(interval) && interval > 0) return interval;
  return null;
}

export async function setRegulInterval(interval: number) {
  await writeStored("interval", interval);
}

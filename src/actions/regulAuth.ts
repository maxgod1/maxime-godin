"use server";

import { cookies } from "next/headers";

const PASSWORD = "8315";
const ACCESS_COOKIE = "regul_access";
const ACCESS_VALUE = "granted";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function unlockRegul(password: string) {
  if (password !== PASSWORD) return { ok: false as const };

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, ACCESS_VALUE, cookieOptions);
  return { ok: true as const };
}

export async function lockRegul() {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

export async function isRegulUnlocked() {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value === ACCESS_VALUE;
}

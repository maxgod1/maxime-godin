"use server";

import { cookies } from "next/headers";

const ACCESS_COOKIE = "regul_access";

export async function isRegulUnlocked() {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value === "granted";
}

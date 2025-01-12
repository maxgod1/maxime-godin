"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(theme: "dark" | "light") {
  (await cookies()).set("theme", theme);
}

export async function getTheme() {
  const theme = (await (await cookies()).get("theme")?.value) as "dark" | "light" | undefined;
  return theme;
}

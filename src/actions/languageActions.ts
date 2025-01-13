"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { availableCountries } from "../database/countries";
import { LanguageStrings } from "../types/countries";

const [lang0, ...rest] = [...availableCountries.map((c) => c.langCode)];

export async function setLanguageCookie(lang: LanguageStrings) {
  const schema = z.object({ lang: z.enum([lang0, ...rest]) });
  const data = schema.parse({ lang });
  (await cookies()).set("lang", data.lang);
  return { selectedLang: data.lang };
}

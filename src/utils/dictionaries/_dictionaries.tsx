import "server-only";

import { defaultLocale, isLanguage } from "../../database/countries";
import { LanguageStrings } from "../../types/countries";
import { DictionaryProjectList } from "../../types/dictionaries";

const dictionaries: Record<DictionaryProjectList, Record<LanguageStrings, () => Promise<Record<string, string>>>> = {
  home: {
    "en-GB": () => import("./home/en-GB.json").then((module) => module.default),
    fr: () => import("./home/fr.json").then((module) => module.default),
    ja: () => import("./home/ja.json").then((module) => module.default),
  },
  metadata: {
    "en-GB": () => import("./metadata/en-GB.json").then((module) => module.default),
    fr: () => import("./metadata/fr.json").then((module) => module.default),
    ja: () => import("./metadata/ja.json").then((module) => module.default),
  },
};

export const getDictionary = async (project: DictionaryProjectList, locale: string): Promise<Record<string, string>> => {
  const resolved = isLanguage(locale) ? locale : defaultLocale;
  return dictionaries[project][resolved]();
};

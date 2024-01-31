import "server-only";

import { LanguageStrings } from "../../types/countries";
import { DictionaryProjectList } from "../../types/dictionaries";

export const getDictionary = async (project: DictionaryProjectList, locale: LanguageStrings): Promise<Record<string, string>> => ({
  ...(await getDictionarySync(project, locale)),
});

const getDictionarySync = async (project: DictionaryProjectList, locale: LanguageStrings): Promise<Record<string, string>> =>
  import(`./${project}/${locale || "en-US"}.json`).then((module) => module.default);

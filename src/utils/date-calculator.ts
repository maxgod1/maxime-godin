import { LanguageStrings } from "../types/countries";

export default function formatDates(dates?: [Date | undefined, Date | undefined | null], lang?: LanguageStrings) { // birthday is a date
    const startDate = (dates?.[0])?.toLocaleDateString(lang, { year: "numeric", month: "short" });
    const endDate = (dates?.[1])?.toLocaleDateString(lang, { year: "numeric", month: "short" }) || "current";

    return { startDate, endDate };

}
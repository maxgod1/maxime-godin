import { LanguageStrings, } from "./countries";


export interface Education {
    name: string;
    logo?: string;
    dates: [Date, Date];
    location: Partial<Record<LanguageStrings, string>>;
    description: Partial<Record<LanguageStrings, string>>;
    link?: string;
};
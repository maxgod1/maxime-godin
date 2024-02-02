import { LanguageStrings, } from "./countries";


export interface Experience {
    companyLogo: string;
    companyName: string;
    dates: [Date, Date | null];
    title: string;
    location: Partial<Record<LanguageStrings, string>>;
    description: Partial<Record<LanguageStrings, string>>;
    link: string;
    tags: string[];
};

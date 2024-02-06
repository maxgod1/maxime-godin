import { LanguageStrings, } from "./countries";

export interface Position {

    dates: [Date, Date | null];
    title: Partial<Record<LanguageStrings, string>>;
    location: Partial<Record<LanguageStrings, string>>;
    link?: string;
    tags: string[];

}

export interface Experience {
    companyLogo: string;
    companyName: string;
    dates?: [Date, Date | null];
    title?: Partial<Record<LanguageStrings, string>>;
    location?: Partial<Record<LanguageStrings, string>>;
    description?: Partial<Record<LanguageStrings, string>>;
    link?: string;
    tags?: string[];
    positions?: Position[];
};

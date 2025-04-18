import { LanguageStrings, } from "./countries";


export interface ResumeLink {
    title: Partial<Record<LanguageStrings, string>>;
    logo?: string;
    link: string;
};
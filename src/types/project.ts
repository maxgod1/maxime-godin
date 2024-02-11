import { LanguageStrings, } from "./countries";

export interface Project {
    image: string;
    title: string;
    subtitle: Partial<Record<LanguageStrings, string>>;
    description: Partial<Record<LanguageStrings, string>>;
    link: string;
    videoLink?: string;
    tags: string[];
    logo: { light: string, dark: string; },
};

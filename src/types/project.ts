import { LanguageStrings, } from "./countries";

export interface Project {
    image: string;
    subtitle: string;
    title: string;
    description: Partial<Record<LanguageStrings, string>>;
    link: string;
    videoLink?: string;
    stackLogos: string[];
    tags: string[];
};

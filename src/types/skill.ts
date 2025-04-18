export interface Skill {
    "en-GB": string;
    fr: string;
    ja: string;
    subSkills: {
        "en-GB": string;
        fr: string;
        ja: string;
        ranking: number;
    }[];
    links: {
        link: string;
        "en-GB": string;
        fr: string;
        ja: string;
    }[];
}
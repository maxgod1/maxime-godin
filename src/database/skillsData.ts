import { Skill } from "../types/skill";

export const skillsData: Skill[] = [
    {
        "en-GB": "Product & web engineering", fr: "Ingénierie web", ja: "ウェブエンジニアリング", subSkills: [
            { "en-GB": "Product localization", fr: "Product localization", ja: "製品ローカライゼーション", ranking: 5 },
            { "en-GB": "Full-Stack engineering", fr: "Ingénierie Full-Stack", ja: "フルスタックエンジニアリング", ranking: 5 },
            { "en-GB": "Mobile development", fr: "Developmenet mobile ", ja: "モバイル開発", ranking: 4 },
            { "en-GB": "UI/UX", fr: "UI/UX ", ja: "UI/UX", ranking: 4 },
            { "en-GB": "Typescript", fr: "Typescript ", ja: "Typescript", ranking: 5 },
            { "en-GB": "React/Next.Js", fr: "React/Next.Js ", ja: "React/Next.Js", ranking: 5 },
            { "en-GB": "React Native/Expo", fr: "React Native/Expo ", ja: "React Native/Expo", ranking: 5 },
            { "en-GB": "MongoDB", fr: "MongoDB ", ja: "MongoDB", ranking: 3 },
            { "en-GB": "Tailwind CSS", fr: "Tailwind CSS ", ja: "Tailwind CSS", ranking: 4 },
            { "en-GB": "Supabase", fr: "Supabase ", ja: "Supabase", ranking: 3 },
        ], links: [{ link: "/stack", "en-GB": "see the tech I use", fr: "see the tech I use", ja: "see the tech I use" }, { link: "/projects", "en-GB": "Explore my dev projects", fr: "Explore my dev projects", ja: "Explore my dev projects" }]
    },
    {
        "en-GB": "Entrepreneurial skills", fr: "Compétences entrepreneuriales", ja: "起業家精神", subSkills: [
            { "en-GB": "Japan entry consulting", fr: "Conseil à l'entrée au Japon", ja: "日本進出コンサルティング", ranking: 5 },
            { "en-GB": "Business Strategy", fr: "Business Strategy", ja: "ビジネス開発", ranking: 4 },
            { "en-GB": "Financial modeling", fr: "Modélisation financière", ja: "財務モデリング", ranking: 3 },
            { "en-GB": "Data analytics", fr: "Analyse des données", ja: "データ分析", ranking: 3 }
        ], links: [{ link: "#experience", "en-GB": "experience", fr: "experience", ja: "experience" }]

    }];

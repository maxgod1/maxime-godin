import { Skill } from "../types/skill";

export const skillsData: Skill[] = [
    {
        "en-GB": "Product & web engineering", fr: "Ingénierie web", ja: "ウェブエンジニアリング", subSkills: [
            { "en-GB": "Product localization", fr: "Product localization", ja: "製品ローカライゼーション", ranking: 5 },
            { "en-GB": "Full-Stack engineering", fr: "Ingénierie Full-Stack", ja: "フルスタックエンジニアリング", ranking: 5 },
            { "en-GB": "Mobile application development", fr: "Developmenet d'applications mobiles ", ja: "モバイルアプリ開発", ranking: 4 }
        ], links: [{ link: "/stack", "en-GB": "see the tech I use", fr: "see the tech I use", ja: "see the tech I use" }, { link: "/projects", "en-GB": "Explore my dev projects", fr: "Explore my dev projects", ja: "Explore my dev projects" }]
    },
    {
        "en-GB": "Entrepeneuriship", fr: "Entrepreunariat", ja: "起業家精神", subSkills: [
            { "en-GB": "Japan entry consulting", fr: "Conseil à l'entrée au Japon", ja: "日本進出コンサルティング", ranking: 5 },
            { "en-GB": "Business Strategy", fr: "Business Strategy", ja: "ビジネス開発", ranking: 4 },
            { "en-GB": "Financial modeling", fr: "Modélisation financière", ja: "財務モデリング", ranking: 3 },
            { "en-GB": "Data analytics", fr: "Analyse des données", ja: "データ分析", ranking: 3 }
        ], links: [{ link: "#experience", "en-GB": "experience", fr: "experience", ja: "experience" }]

    }];

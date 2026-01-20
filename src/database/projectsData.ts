import { Project } from "../types/project";


export const projectsData: Project[] = [
    {
        title: "tokyo design season",
        subtitle: { "en-GB": "Lead Engineer - 2025", fr: "Lead Engineer - 2025", ja: "Lead Engineer - 2025" },
        description: {
            "en-GB": "This is a platform to find design events and festivals in Tokyo during Design Season, with a full admin csm system to manage the events.",
            fr: "C'est une plateforme pour trouver des événements et des festivals de design à Tokyo pendant la saison du design, avec un système d'administration complet pour gérer les événements.",
            ja: "デザインの季節を、もっと自由に。デザイナーの方々にとって、もっと便利に。"
        },
        image: "tds",
        link: "https://tokyodesignseason.jp",
        logo: { light: "tds_logo-light", dark: "tds_logo-dark" },
        videoLink: "",
        tags: ["React", "Next.js", "Typescript", "NodeJs", "Convex", "Vercel", "Stripe", "PostHog"]
    },
    {
        title: "Forgigs Pages",
        subtitle: { "en-GB": "CTO - 2025", fr: "CTO - 2024", ja: "CTO - 2024" },
        description: {
            "en-GB": "A website builder specifically tailored for musicians and venues and creatores. It allows them to create a website with a custom domain, upload their music, and sell their music directly to their fans.",
            fr: "Un constructeur de site web spécifiquement conçu pour les musiciens, les lieux  et les créateurs. Il leur permet de créer un site web avec un domaine personnalisé, de télécharger leur musique et de la vendre directement à leurs fans.",
            ja: "アーティストや会場、クリエイター向けのウェブサイトビルダー。カスタムドメインを使用してウェブサイトを作成し、音楽をアップロードし、直接ファンに販売できます。"
        },
        image: "forgigs_pages",
        link: "https://pages.forgigs.com",
        logo: { light: "forgigs_logo-light", dark: "forgigs_logo-dark" },
        videoLink: "",
        tags: ["React", "Next.js", "Typescript", "NodeJs", "Convex", "Vercel", "Stripe", "PostHog"]
    },
    {
        title: "JBTimeConcept",
        subtitle: { "en-GB": "CTO - 2024", fr: "CTO - 2024", ja: "CTO - 2024" },
        description: {
            "en-GB": "JBTime Concept is a calculation center specialized in amateur and historical car rallies. I developed a comprehensive system including an admin interface for creating and managing rallies, a participant-facing platform for real-time rankings and rally information consultation with live SMS notifications, and a live monitoring interface for organizers to track the event in real-time.",
            fr: "JBTime Concept est un centre de calcul spécialisé dans les rallyes automobiles amateurs et historiques. J'ai développé un système complet comprenant une interface administrateur pour la création et la gestion des rallyes, une plateforme destinée aux participants pour consulter les classements en temps réel et les informations du rallye avec notifications SMS en direct, ainsi qu'une interface de suivi en direct pour les organisateurs.",
            ja: "JBTime Conceptはアマチュアやヒストリックカーラリーに特化した計算センターです。ラリーの作成と管理のための管理者インターフェース、参加者がリアルタイムのランキングやラリー情報を確認できるSMSによるリアルタイム通知機能付きプラットフォーム、そして主催者がイベントをリアルタイムで追跡できるモニタリングインターフェースを含む包括的なシステムを開発しました。"
        },
        image: "jbtc",
        link: "https://new.jbtc.be",
        logo: { light: "jbtc_logo-light", dark: "jbtc_logo-dark" },
        videoLink: "",
        tags: ["React", "Next.js", "Typescript", "NodeJs", "Express", "Supabase", "Vercel", "Twilio", "PostHog"]
    },
    {
        title: "Forgigs",
        subtitle: { "en-GB": "CEO/CTO - 2020", fr: "CEO/CTO - 2020", ja: "CEO/CTO - 2020" },
        description: {
            "en-GB": "While I was working for nearly 10 years in music streaming, I noticed a gap between the distribution side of the music industry and live performances. I set myself on a journey to bridge that gap and make it as easy for independent artists to organize tours as it is for them to distribute their music on streaming platforms. Forgigs streamlines the process of organizing tours for independent artists by offering one platform for artists, venues, promoters, bookers, and music fans, covering seamlessly everything from booking, ticketing, merchandising, tipping, settlements, and more...",
            fr: "Durant mes 10 ans dans l'industrie du streaming musucal, j'ai remarqué un écart entre le côté distribution et l'industrie du concert. Je me suis lancé dans le projet de combler cet écart et faciliter aux artistes indépendants l'organisation de tournées. L'idée est de rendre aussi facile l'organisation de concerts que la distribution de leur musique sur les plateformes de streaming.",
            ja: "音楽ストリーミング業界で10年間働いた間に、音楽業界の配信側とライブパフォーマンスの間にギャップがあることに気付きました。私はそのギャップを埋めるための取り組みを始め、独立アーティストがツアーを組織することを容易にすることを目指しました。コンサートの組織をストリーミングプラットフォームでの音楽配信と同じくらい簡単にすることがアイデアです。"
        },
        image: "forgigs",
        link: "https://booking.forgigs.com",
        logo: { light: "forgigs_logo-light", dark: "forgigs_logo-dark" },
        videoLink: "https://www.youtube.com/embed/2jF9Y2aQ9qk",
        tags: ["React", "React-native", "Next.js", "Expo", "Typescript", "NodeJs", "Mongodb", "AWS", "Vercel", "Stripe", "Sendgrid", "Google Analytics"]
    },
    {
        title: "Tempura Magazine",
        subtitle: { "en-GB": "CTO - 2021", fr: "CTO - 2021", ja: "CTO - 2021" },
        description: {
            "en-GB": "As part of the original team of the paper magazine Tempura I managed every aspect of the digital platforms: the creation of a Shopify store, the creation of Tempura's landing page and the creation and development of a full subscription plateform",
            fr: "En tant que membre original de l'équipe du magazine papier Tempura, j'ai géré tous les aspects des plateformes numériques : la création d'une boutique Shopify, la création de la page d'accueil de Tempura et la création et le développement d'une plateforme d'abonnement complète.",
            ja: "ペーパーマガジンのTempura の元のチームの一員として、デジタルプラットフォームのあらゆる側面を管理しました：Shopifyストアの作成、Tempuraのランディングページの作成、そして完全な定期購読プラットフォームの作成と開発。"
        },
        image: "tempura",
        link: "https://tempuramag.com",
        logo: { light: "tempura_logo-light", dark: "tempura_logo-dark" },
        videoLink: "https://www.youtube.com/embed/2jF9Y2aQ9qk",
        tags: ["React", "Next.js", "Typescript", "NodeJs", "Supabase", "Stripe", "Mailchimp", "Calameo", "Google Analytics"]
    },


];
export default projectsData;
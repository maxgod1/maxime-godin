import { Project } from "../types/project";


export const projectsData: Project[] = [
    {
        title: "Forgigs Pages",
        subtitle: { "en-GB": "CTO - 2025", fr: "CTO - 2024", ja: "CTO - 2024" },
        description: {
            "en-GB": "A website builder specifically tailored for musicians and artists. It allows them to create a website with a custom domain, upload their music, and sell their music directly to their fans.",
            fr: "Un constructeur de site web spécifiquement conçu pour les musiciens et les artistes. Il leur permet de créer un site web avec un domaine personnalisé, de télécharger leur musique et de la vendre directement à leurs fans.",
            ja: "音楽家やアーティスト向けのウェブサイトビルダー。カスタムドメインを使用してウェブサイトを作成し、音楽をアップロードし、直接ファンに販売できます。"
        },
        image: "forgigs_pages",
        link: "https://pages.forgigs.com",
        logo: { light: "forgigs_logo-light", dark: "forgigs_logo-dark" },
        videoLink: "",
        tags: ["React", "Next.js", "Typescript", "NodeJs", "Supabase", "Vercel", "Srtipe", "PostHog"]
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
        link: "https://new.jbtc.be/live/yhr2024",
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
    link: "https://bookking.forgigs.com",
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
{
    title: "Artemis Care　🏗️",
    subtitle: { "en-GB": "Lead developer - 2023", fr: "Développeur principal - 2023", ja: "リードデベロッパー - 2023" },
    description: {
        "en-GB": "Artemis Care is a France Base project aiming to give access to easy to understand information about infertility to people whether they are just curious, worried about their fertility, or already have fertility issues. For this project, I have built a platform consisting of: a list of resources that users can browse and add to their favorites, an AI assistant capable of giving users reliable information based on the resources, and additional features such as a pre-diagnosis to guide users even more through getting the information they need.",
        fr: "Artemis Care est un projet basé en France visant à donner accès à des informations faciles à comprendre sur l'infertilité aux personnes qu'elles soient simplement curieuses, inquiètes de leur fertilité ou rencontrent déjà des problèmes de fertilité. Pour ce projet, j'ai construit une plateforme composée : d'une liste de ressources que les utilisateurs peuvent parcourir et ajouter à leurs favoris, d'un assistant d'intelligence artificielle capable de fournir aux utilisateurs des informations fiables basées sur les ressources, et de fonctionnalités supplémentaires telles qu'un pré-diagnostic pour guider encore plus les utilisateurs dans l'obtention des informations dont ils ont besoin.",
        ja: "Artemis Careはフランス拠点のプロジェクトで、不妊について簡単に理解できる情報にアクセスできるようにすることを目指しています。その人が単に好奇心を持っているだけでなく、自分の妊娠力について心配している人やすでに不妊の問題を抱えている人にも。このプロジェクトでは、ユーザーが参照してお気に入りに追加できるリソースのリスト、リソースに基づいた信頼性の高い情報をユーザーに提供することができるAIアシスタント、必要な情報をより詳しく案内するための予備診断などの追加機能から構成されるプラットフォームを構築しました。"
    },
    image: "artemis",
    link: "https://artemis-1mv4jyjbu-forgigs.vercel.app",
    logo: { light: "artemis_logo-light", dark: "artemis_logo-dark" },
    videoLink: "https://www.youtube.com/embed/2jF9Y2aQ9qk",
    tags: ["React", "Next.js", "Typescript", "NodeJs", "Supabase", "Stripe", "Openai API", "PostHog"]
}
    ,
];
export default projectsData;
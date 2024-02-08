import { Experience } from "../types/experience";


export const experiencesData: Experience[] = [
    {
        companyName: "Qobuz",
        companyLogo: "qobuz.png",
        dates: [new Date(2021, 0, 11), null],
        title: {
            "en-GB": "Japan market entry and product localization consultant",
            fr: "Consultant en entrée sur le marché japonais et localisation de produit",
            ja: "日本市場参入と製品ローカライズコンサルタント"
        },
        location: {
            "en-GB": "Tokyo, Japan",
            fr: "Tokyo, Japon",
            ja: "東京、日本"
        },
        description: {
            "en-GB": "Spearheaded the integration and localization of Qobuz's download and streaming services for the Japanese market, following the acquisition of local high-res download service: e-onkyo music. Led a cross-cultural team to adapt the platform to align with the unique preferences and trends of the Japanese audience. Focused on cultural adaptation, content localization, and technology integration to ensure a seamless user experience.",
            fr: "J'ai dirigé l'intégration et la localisation des services de téléchargement et de streaming de Qobuz pour le marché japonais, suite à l'acquisition du service de téléchargement local haute résolution : e-onkyo music. J'ai dirigé une équipe pluriculturelle pour adapter la plateforme afin de correspondre aux préférences et tendances uniques du public japonais. J'ai mis l'accent sur l'adaptation culturelle, la localisation du contenu et l'intégration technologique afin d'assurer une expérience utilisateur fluide.",
            ja: "日本市場向けにQobuzのダウンロードおよびストリーミングサービスの統合とローカライゼーションを牽引しました。これは、現地のハイレゾダウンロードサービスであるe-onkyo musicを買収した後の取り組みです。日本の観客のユニークな嗜好やトレンドに合わせてプラットフォームを適応するため、異文化チームのリーダーとなりました。文化的な適応、コンテンツのローカライゼーション、テクノロジーの統合に焦点を当て、シームレスなユーザーエクスペリエンスを確保するために努めました。"
        },
        tags: ["Product localization", "Market entry"],
        link: "https://qobuz.com",
    },
    {
        companyName: "Forgigs",
        companyLogo: "forgigs.png",
        title: {
            "en-GB": "Founder & CTO",
            fr: "Fondateur & CTO",
            ja: "創業者＆CTO"
        }, dates: [new Date(2020, 0, 1), null],
        location: {
            "en-GB": "Tokyo, Japan / Paris, France",
            fr: "Tokyo, Japon / Paris, France",
            ja: "東京、日本 / パリ、フランス"
        },
        description: {
            "en-GB": "While I was working for nearly 10 years in music streaming, I noticed a gap between the distribution side of the music industry and live performances. I set myself on a journey to bridge that gap and make it as easy for independent artists to organize tours as it is for them to distribute their music on streaming platforms. Forgigs streamlines the process of organizing tours for independent artists by offering one platform for artists, venues, promoters, bookers, and music fans, covering seamlessly everything from booking, ticketing, merchandising, tipping, settlements, and more...",
            fr: "Durant mes 10 ans dans l'industrie du streaming musucal, j'ai remarqué un écart entre le côté distribution et l'industrie du concert. Je me suis lancé dans le projet de combler cet écart et faciliter aux artistes indépendants l'organisation de tournées. L'idée est de rendre aussi facile l'organisation de concerts que la distribution de leur musique sur les plateformes de streaming.",
            ja: "音楽ストリーミング業界で10年間働いた間に、音楽業界の配信側とライブパフォーマンスの間にギャップがあることに気付きました。私はそのギャップを埋めるための取り組みを始め、独立アーティストがツアーを組織することを容易にすることを目指しました。コンサートの組織をストリーミングプラットフォームでの音楽配信と同じくらい簡単にすることがアイデアです。"
        },
        link: "https://forgigs.com",
        tags: ["React", "React-native", "Next.js", "Expo", "Typescript", "NodeJs", "Mongodb", "AWS", "Vercel", "Stripe", "Sendgrid", "Google Analytics"]
    },
    {
        companyName: "Jave",
        companyLogo: "jave.png",
        title: {
            "en-GB": "Head of Business Development",
            fr: "Directeur du développement commercial",
            ja: "ビジネス開発部長"
        },
        dates: [new Date(2019, 10, 1), new Date(2021, 9, 1)],
        location: {
            "en-GB": "Tokyo, Japan / Paris, France",
            fr: "Tokyo, Japon / Paris, France",
            ja: "東京、日本 / パリ、フランス"
        },
        description: {
            "en-GB": "JAVE is the podcast/media division of Japanese radio station J-WAVE, operating under the brand name Spinear. I oversaw relationships with key streaming platforms, enhancing J-WAVE's podcast distribution network. Provided advice on podcast production, aligning content strategy with market trends and platform capabilities.",
            fr: "JAVE est la division podcast/médias de la station de radio japonaise J-WAVE, opérant sous le nom de marque Spinear. J'ai supervisé les relations avec les principales plateformes de streaming, améliorant le réseau de distribution de podcasts de J-WAVE. J'ai donné des conseils sur la production de podcasts, en alignant la stratégie de contenu avec les tendances du marché et les capacités de la plateforme.",
            ja: "JAVEは、日本のラジオ局J-WAVEのポッドキャスト/メディア部門で、Spinearというブランド名で運営されています。私は主要なストリーミングプラットフォームとの関係を監督し、J-WAVEのポッドキャスト配信ネットワークを強化しました。ポッドキャスト制作に関するアドバイスを提供し、コンテンツ戦略を市場のトレンドとプラットフォームの機能に合わせて調整しました。"
        },
        link: "https://spinear.com/",
        tags: ["Business Development", "Streaming distribution", "Product"]
    },
    {
        companyName: "Tempura",
        companyLogo: "Tempura.png",
        title: {
            "en-GB": "CTO",
            fr: "CTO",
            ja: "CTO"
        },
        dates: [new Date(2020, 0, 1), new Date(2023, 6, 1)],
        location: {
            "en-GB": "Tokyo, Japan / Paris, France",
            fr: "Tokyo, Japon / Paris, France",
            ja: "東京、日本 / パリ、フランス"
        },
        description: {
            "en-GB": "Tempura Magazine, established in France in 2019, offers a unique exploration of Japanese culture and society, emphasizing underground and subcultural aspects. It combines in-depth journalism and strong visual identity to challenge common stereotypes about Japan, covering diverse and unconventional topics. I oversaw every digital aspect of the magazine, including the creation of a Shopify store, the creation of Tempura's landing page, and the creation and development of a full digital subscription platform.",
            fr: "Tempura Magazine, créé en France en 2019, propose une exploration unique de la culture et de la société japonaises, mettant l'accent sur les aspects underground et subculturels. Il combine un journalisme approfondi et une identité visuelle forte pour remettre en question les stéréotypes courants sur le Japon, couvrant des sujets divers et non conventionnels. J'ai supervisé tous les aspects numériques du magazine, y compris la création d'une boutique Shopify, la création de la page d'accueil de Tempura et la création et le développement d'une plateforme d'abonnement numérique complète.",
            ja: "Tempura Magazineは2019年にフランスで設立され、日本の文化と社会のユニークな探求を提供し、アンダーグラウンドとサブカルチャーの側面を強調しています。深いジャーナリズムと強いビジュアルアイデンティティを組み合わせて、日本についての一般的なステレオタイプに挑戦し、多様で非伝統的なトピックをカバーしています。私は、Tempuraのデジタル全般を監督しました。ショッピファイストアの作成、Tempuraのランディングページの作成、そして完全なデジタル定期購読プラットフォームの作成と開発。"
        },
        link: "https://tempuramag.com",
        tags: ["React", "React-native", "Next.js", "Typescript", "NodeJs", "Supabase", "Vercel", "Stripe", "Mailchimp", "Google Analytics"]
    },
    {
        companyName: "Deezer",
        companyLogo: "deezer.png",
        description: {
            "en-GB": "My career at Deezer began in the Ad Sales department within the Special Operations team in 2013, where I focused on project management, playing a key role in executing complex and innovative projects for renowned brands using the Deezer technology. I then transitioned to a strategic role in London, working under the Chief International Officer. In this capacity, I coordinated vital projects and special initiatives critical to Deezer's international expansion. In 2018 I led the launch of Deezer in Japan, project that I had championed and developed internally over several years.",
            fr: "Ma carrière chez Deezer a commencé en 2013 dans le département des Ventes Publicitaires au sein de l'équipe des Opérations Spéciales, où j'étais responsable de la gestion de projets et jouais un rôle clé dans l'exécution de projets complexes et innovants pour des marques renommées en utilisant la technologie Deezer. Ensuite, j'ai occupé un poste stratégique à Londres, travaillant sous la direction du Directeur International. Dans cette fonction, j'ai coordonné des projets vitaux et des initiatives spéciales cruciales pour l'expansion internationale de Deezer. En 2018, j'ai dirigé le lancement de Deezer au Japon, un projet que j'ai soutenu et développé en interne pendant plusieurs années.",
            ja: "「Deezerでのキャリアは2013年にスペシャル オペレーションズ チームの広告営業部門で始まりました。プロジェクトマネジメントに力を注ぎ、Deezerのテクノロジーを使って有名ブランド向けに複雑で革新的なプロジェクトの実行において重要な役割を果たしてきました。その後、ロンドンでチーフ インターナショナル オフィサーの下で戦略的な役割に移行しました。この役職では、Deezerの国際展開に重要なプロジェクトや特別なイニシアチブの調整を行ってきました。2018年には数年にわたり内部で推進し開発してきたDeezerの日本でのローンチをリードしました。」"
        },
        link: "https://deezer.com",
        tags: ["Product Localization", "International Expansion", "Market entry", "business Strategy", "Ad-sales", "Project Management"],
        positions: [
            {
                title: {
                    "en-GB": "Head of Operations - Japan",
                    fr: "Directeur des opérations - Japon",
                    ja: "日本オペレーションズマネージャー"
                },
                dates: [new Date(2018, 0, 1), new Date(2019, 9, 1)],
                location: {
                    "en-GB": "Tokyo, Japan",
                    fr: "Tokyo, Japon",
                    ja: "東京、日本"
                },

            },
            {

                title: {
                    "en-GB": "Expansion Manager",
                    fr: "Expansion Manager",
                    ja: "エキスパンションマネージャー"
                },
                dates: [new Date(2015, 6, 1), new Date(2017, 11, 1)],
                location: {
                    "en-GB": "London, UK",
                    fr: "Londres, Royaume-Uni",
                    ja: "ロンドン、イギリス"
                },
            },
            {

                title: {
                    "en-GB": "Project Manager",
                    fr: "Chef de projet",
                    ja: "プロジェクトマネージャー"
                },
                dates: [new Date(2013, 9, 1), new Date(2015, 5, 1)],
                location: {
                    "en-GB": "Paris, France",
                    fr: "Paris, France",
                    ja: "パリ、フランス"
                },
            },
        ]
    },
    {
        companyName: "NOVA",
        companyLogo: "nova.png",
        dates: [new Date(2012, 1, 1), new Date(2023, 10, 1)],
        title: {
            "en-GB": "French Language Instructor",
            fr: "Enseignant de langue française",
            ja: "フランス語講師"
        },

    },
    {
        companyName: "HSBC",
        companyLogo: "hsbc.png",
        dates: [new Date(2011, 2, 1), new Date(2023, 11, 1)],
        title: {
            "en-GB": "Personal Banker",
            fr: "Conseiller financier",
            ja: "パーソナルバンカー "
        },
    }


];
export default experiencesData;
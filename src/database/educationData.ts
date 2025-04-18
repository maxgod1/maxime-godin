import { Education } from "../types/education";


export const educationData: Education[] = [{
    name: "HEC Montreal",
    logo: "hec.png",
    dates: [new Date(2008, 0, 1), new Date(2011, 0, 1)],
    location: {
        "en-GB": "Montreal, Canada",
        fr: "Montréal, Canada",
        ja: "カナダ、モントリオール"
    },
    description: {
        "en-GB": "Bachelor in Business Administration, Finance option",
        fr: "Baccalauréat en administration des affaires, option finance",
        ja: "経営学士、ファイナンスオプション"
    },
    link: "https://www.hec.ca",
},
{
    name: "Lycée Vauvenargues",
    dates: [new Date(2008, 0, 1), new Date(2010, 0, 1)],
    location: {
        "en-GB": "Aix-en-Provence, France",
        fr: "Aix-en-Provence, France",
        ja: "フランス、エクサンプロバンス"
    },
    description: {
        "en-GB": "Engineering preparation school, applied Mathematics and Physics",
        fr: "Classe préparatoire aux grandes écoles, Mathématiques et Physique appliquées",
        ja: "工学準備学校、応用数学と物理学"
    },
},

];
export default educationData;
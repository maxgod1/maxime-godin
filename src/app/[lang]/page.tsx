import Link from "next/link";
import _calculateAge from "../../helper/age-calucator";
import { LanguageStrings } from "../../types/countries";
import educationData from "../../database/educationData";
import experiencesData from "../../database/experiencesData";
import { getDictionary } from "../../utils/dictionaries/_dictionaries";
import injectVariables from "../../utils/dictionaries/injectVariables";
import EducationItem from "./_components/EducationItem";
import ExperienceItem from "./_components/ExperienceItem";
import Button from "./_components/Button";
import { LanguageIcon } from "@heroicons/react/24/outline";
import ResumeIntro from "./_components/ResumeIntro";

export default async function Home({ params }: { params: { lang: LanguageStrings } }) {
  const strings = await getDictionary("home", params.lang);
  return (
    <div className="fade-in w-full flex flex-col gap-10 items-center lg:mb-10 mb-20 pt-3 ">
      <ResumeIntro strings={strings} />
      <div className="max-w-[800px] w-full lg:px-0 px-4">
        <div className="pl-[6px] flex flex-col items-start gap-6 w-full relative">
          <ResumeSideBar />
          <ResumeTitle title={strings.experience} />
          {experiencesData.map((data, i) => (
            <ExperienceItem key={i + data.companyName} data={data} />
          ))}
          <ResumeTitle title={strings.education} />
          {educationData.map((data) => (
            <EducationItem key={data.name} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
}

const ResumeTitle = ({ title }: { title: string }) => (
  <div className="w-full text-start fade-in ">
    <p className="text-4xl font-bold mb-2 pl-5">{title}</p>
    <div className="-mt-[5px] flex w-full">
      <div className="h-[2px] w-1/2 bg-black/20 dark:bg-white/20" />
      <div className="h-[2px] w-1/2 bg-black/20 dark:bg-white/20" />
      <div className="h-[2px] w-1/2 bg-gradient-to-r  from-black/20 to-black/0 dark:from-white/20 dark:to-white/0" />
    </div>
  </div>
);

const ResumeSideBar = () => (
  <div className="h-[calc(100%-39px)] absolute left-[4px] mt-[39px] fade-in">
    <div className="absolute w-[2px] h-[60px] -mt-[60px] bg-gradient-to-b to-black/20 dark:to-white/20 from-transparent " />
    <div className="w-[2px] h-full bg-black/20 dark:bg-white/20" />
    <div className="absolute w-[2px] h-[30px] -mb-[30px]  bg-gradient-to-b from-black/20 dark:from-white/20 to-transparent rounded-b-full" />
  </div>
);

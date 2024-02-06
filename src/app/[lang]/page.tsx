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

export default async function Home({ params }: { params: { lang: LanguageStrings } }) {
  const strings = await getDictionary("home", params.lang);
  return (
    <div className="fade-in w-full flex flex-col gap-10 items-center lg:mb-10 mb-20 ">
      <ResumeIntro strings={strings} />
      <div className="max-w-[800px] w-full lg:px-0 px-4">
        <div className="pl-[7px] flex flex-col items-start gap-6 w-full relative">
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
  <div className="w-full text-center fade-in">
    <p className="text-3xl font-bold mb-2 ">{title}</p>
    <div className="-mt-[5px] flex w-full">
      <div className="h-[3px] w-1/2 bg-black/20 dark:bg-white/20" />
      <div className="h-[3px] w-1/2 bg-black/20 dark:bg-white/20" />
      <div className="h-[3px] w-1/2 bg-gradient-to-r  from-black/20 to-black/0 dark:from-white/20 dark:to-white/0" />
    </div>
  </div>
);

const ResumeSideBar = () => (
  <div className="h-[calc(100%-39px)] absolute left-[4px] mt-[39px] fade-in">
    <div className="absolute w-[3px] h-[60px] -mt-[60px] bg-gradient-to-b to-black/20 dark:to-white/20 from-transparent " />
    <div className="w-[3px] h-full bg-black/20 dark:bg-white/20" />
    <div className="absolute w-[3px] h-[30px] -mb-[30px]  bg-gradient-to-b from-black/20 dark:from-white/20 to-transparent rounded-b-full" />
  </div>
);

const ResumeIntro = ({ strings }: { strings: Record<string, string> }) => (
  <div className="max-w-[800px] lg:px-1 px-5">
    <p className="text-3xl font-bold">Maxime Godin</p>
    <p className="text-md font-light">{injectVariables(strings.age, { age: _calculateAge(new Date("1989/01/07")) })} • Tokyo, JP</p>
    <p className="w-full py-3 lg:text-lg ">{injectVariables(strings.me_descritpion, { years: _calculateAge(new Date("2019/01/01")) })}</p>
    <div className="py-3 flex gap-3">
      <Link href="/projects">
        <Button title={strings.see_projects} />
      </Link>
      <Link href="/stack">
        <Button title={strings.see_stack} />
      </Link>
    </div>
  </div>
);

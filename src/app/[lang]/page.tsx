import Link from "next/link";
import _calculateAge from "../../helper/age-calucator";
import { LanguageStrings } from "../../types/countries";
import educationData from "../../database/educationData";
import experiencesData from "../../database/experiencesData";
import { getDictionary } from "../../utils/dictionaries/_dictionaries";
import EducationItem from "./_components/EducationItem";
import ExperienceItem from "./_components/ExperienceItem";
import ResumeIntro from "./_components/ResumeIntro";
import { skillsData } from "../../database/skillsData";
import SkillItem from "./_components/SkillItem";
import { AcademicCapIcon, AdjustmentsHorizontalIcon, ArrowUpIcon, BriefcaseIcon } from "@heroicons/react/24/solid";

const sideTab = [
  { id: "toTop", Icon: ArrowUpIcon },
  { id: "skills", Icon: AdjustmentsHorizontalIcon },
  { id: "experience", Icon: BriefcaseIcon },
  { id: "education", Icon: AcademicCapIcon },
];

export default async function Home({ params }: { params: { lang: LanguageStrings } }) {
  const strings = await getDictionary("home", params.lang);

  return (
    <>
      <div className="relative">
        <div id="toTop" className="absolute -top-[100px]" />
      </div>
      <div className="absolute flex items-center transition-all lg:right-0  xl:right-[5%] 2xl:right-[15%] lg:top-[20%] top-0 p-2 lg:p-0 lg:w-auto w-full overflow-auto z-30 backdrop-blur-sm no-scrollbar">
        {/* <div className="bg-red-500 h-[80%] w-2 rounded-r absolute" /> */}
        <div className="flex lg:flex-col flex-row gap-2 flex-wrap items-end xl:border-r-2 border-slate-950/20 dark:border-white/20">
          {sideTab.map((tab) => (
            <SideBarTab key={tab.id} title={strings[tab.id]} id={tab.id} Icon={tab.Icon} />
          ))}
        </div>
      </div>

      <div className=" fade-in w-full flex flex-col gap-10 items-center lg:mb-10 mb-20 lg:pt-3 pt-14 ">
        <ResumeIntro strings={strings} />
        <div className="max-w-[800px] w-full md:px-0 px-1">
          <div className="pl-[6px] flex flex-col items-start gap-6 w-full relative">
            <ResumeSideBar />

            <ResumeTitle title={strings.skills} id="skills" />
            {skillsData.map((data, i) => (
              <SkillItem key={i + data["en-GB"]} data={data} />
            ))}

            <ResumeTitle title={strings.experience} id="experience" />
            {experiencesData.map((data, i) => (
              <ExperienceItem key={i + data.companyName} data={data} />
            ))}

            <ResumeTitle title={strings.education} id="education" />
            {educationData.map((data) => (
              <EducationItem key={data.name} data={data} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const SideBarTab = ({
  title,
  id,
  Icon,
}: {
  title: string;
  id: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}) => (
  <Link
    scroll={true}
    href={"#" + id}
    className="group  dark:hover:bg-white/20 hover:bg-slate-950/20  lg:pl-3 pl-1 lg:pr-1 pr-3 transition-all lg:rounded-r-none rounded"
  >
    <div className="flex items-center gap-1 lg:group-hover:-translate-x-1 group-hover:translate-x-1  transition-all">
      {title}
      <Icon className="h-4" />
    </div>
  </Link>
);

const ResumeTitle = ({ title, id }: { title: string; id?: string }) => (
  <div className="w-full text-start fade-in relative">
    <div id={id} className="absolute -top-[80px]" />
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

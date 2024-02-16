import Link from "next/link";
import _calculateAge from "../../helper/age-calucator";
import { LanguageStrings } from "../../types/countries";
import educationData from "../../database/educationData";
import linkData from "../../database/linkData";
import experiencesData from "../../database/experiencesData";
import { getDictionary } from "../../utils/dictionaries/_dictionaries";
import EducationItem from "./_components/EducationItem";
import ExperienceItem from "./_components/ExperienceItem";
import ResumeIntro from "./_components/ResumeIntro";
import { skillsData } from "../../database/skillsData";
import SkillItem from "./_components/SkillItem";
import { AcademicCapIcon, AdjustmentsHorizontalIcon, ArrowUpIcon, BriefcaseIcon, LinkIcon } from "@heroicons/react/24/solid";
import LinkData from "./_components/LinkItem";

const sideTab = [
  { id: "toTop", Icon: ArrowUpIcon },
  { id: "skills", Icon: AdjustmentsHorizontalIcon },
  { id: "experience", Icon: BriefcaseIcon },
  { id: "education", Icon: AcademicCapIcon },
  { id: "links", Icon: LinkIcon },
];

export default async function Home({ params }: { params: { lang: LanguageStrings } }) {
  const strings = await getDictionary("home", params.lang);

  return (
    <>
      <div className="relative">
        <div id="toTop" className="absolute -top-[100px]" />
      </div>
      <div
        className="absolute transition-all w-auto overflow-auto z-30 no-scrollbar
      right-0  xl:right-[5%] 2xl:right-[15%] lg:top-[150px] lg:bottom-0 bottom-[120px] 
      py-2 lg:pl-2 pl-1 pr-2 lg:p-0 
      backdrop-blur-sm lg:bg-transparent lg:dark:bg-transparent dark:bg-slate-950/20 bg-white/20 
      rounded-l-lg"
      >
        {/* <div className="bg-red-500 h-[80%] w-2 rounded-r absolute" /> */}
        <div className="flex flex-col gap-2 flex-wrap items-end xl:border-r-2 border-slate-950/20 dark:border-white/20">
          {sideTab.map((tab) => (
            <SideBarTab key={tab.id} title={strings[tab.id]} id={tab.id} Icon={tab.Icon} />
          ))}
        </div>
      </div>

      <div className=" fade-in w-full flex flex-col gap-10 items-center lg:mb-10 mb-20 lg:pt-3 pt-3 ">
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
            <ResumeTitle title={strings.links} id="links" />
            {linkData.map((data) => (
              <LinkData key={data.title[params.lang]} data={data} />
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
    className="group  lg:dark:hover:bg-white/20 lg:hover:bg-slate-950/20  lg:pl-3 pl-2 lg:pr-1 pr-0 transition-all lg:rounded-r-none rounded"
  >
    <div className="flex items-center gap-1 group-hover:-translate-x-1  transition-all">
      <span className="lg:block hidden">{title}</span>
      <Icon className="lg:h-4 h-6 lg:m-0 m-1" />
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

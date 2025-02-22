"use client";

import _calculateAge from "../../utils/age-calucator";
import educationData from "../../database/educationData";
import linkData from "../../database/linkData";
import experiencesData from "../../database/experiencesData";
import EducationItem from "../components/about/EducationItem";
import ExperienceItem from "../components/about/ExperienceItem";
import ResumeIntro from "../components/about/ResumeIntro";
import { skillsData } from "../../database/skillsData";
import SkillItem from "../components/about/SkillItem";
import { AcademicCapIcon, AdjustmentsHorizontalIcon, ArrowUpIcon, BriefcaseIcon, LinkIcon } from "@heroicons/react/24/solid";
import LinkData from "../components/about/LinkItem";
import { useContext, useEffect, useState, useRef } from "react";
import { GlobalContext } from "../providers/GlobalProvider";

const sideTab = [
  { id: "toTop", Icon: ArrowUpIcon },
  { id: "skills", Icon: AdjustmentsHorizontalIcon },
  { id: "experience", Icon: BriefcaseIcon },
  { id: "education", Icon: AcademicCapIcon },
  { id: "links", Icon: LinkIcon },
];

export default function Home() {
  const { strings, lang } = useContext(GlobalContext);
  const [activeSection, setActiveSection] = useState<"toTop" | "skills" | "experience" | "education" | "links"|undefined>();
  const [loaded, setLoaded] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;
    const handleScroll = () => {
      // Get all sections
      const sections = sideTab.map(tab => ({
        id: tab.id,
        element: document.getElementById(tab.id)
      }));

      // Calculate distance from top for each section
      const sectionDistances = sections
        .map(section => ({
          id: section.id,
          distance: section.element?.getBoundingClientRect().top || Infinity
        }))
        // Filter sections that are above our target zone
        .filter(section => section.distance <= 300);


      // Get the closest section to our target zone (100px from top)
      const activeSection = sectionDistances.reduce((closest, current) => {
        const closestDistance = Math.abs(closest.distance - 100);
        const currentDistance = Math.abs(current.distance - 100);
        return currentDistance < closestDistance ? current : closest;
      }, sectionDistances[0]);

      if (activeSection) {
        setActiveSection(activeSection.id as "toTop" | "skills" | "experience" | "education" | "links");
        window.history.replaceState(null, '', `#${activeSection.id}`);
      }
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check
      handleScroll();
    }

    return () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loaded]);

  // Add this new useEffect for initial anchor scroll
  useEffect(() => {
    // Get the hash without the # symbol
    const hash = window.location.hash.slice(1);
    console.log(hash);
    
    // Check if it's one of our valid sections
    if (sideTab.some(tab => tab.id === hash)) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash);
        console.log(element);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'instant',
            block: 'start'
          });
          setActiveSection(hash as typeof activeSection);
        }
      }, 0);
      setLoaded(true);
    }
  }, []); // Run once on mount

  return (
    <>
      
      <div
      
        className="absolute transition-all w-auto z-30 no-scrollbar right-0 xl:right-[5%] 2xl:right-[15%] lg:top-[150px] lg:bottom-0 bottom-[120px] py-2 lg:pl-2 pl-1 pr-2 lg:p-0  backdrop-blur-sm lg:bg-transparent lg:dark:bg-transparent dark:bg-slate-950/20 bg-white/20  rounded-l-lg"
      >
        {/* <div className="bg-red-500 h-[80%] w-2 rounded-r absolute" /> */}
        <div className="flex flex-col gap-2 flex-wrap items-end xl:border-r-2 border-slate-950/20 dark:border-white/20">
          {sideTab.map((tab) => (
            <SideBarTab key={tab.id} title={strings[tab.id]} id={tab.id} Icon={tab.Icon} activeSection={activeSection} />
          ))}
        </div>
      </div>

      <div 
        ref={mainContentRef}
        className="fade-in w-full flex flex-col gap-10 items-center lg:mb-10 mb-20 pb-[70dvh]  scroll-mt-[100px]"
      >
          <div id="toTop" className="pt-[100px] -mt-[100px]">
            <ResumeIntro strings={strings} />
          </div>
        <div className="max-w-[800px] w-full md:px-0 px-1">
          <div className="pl-[6px] flex flex-col items-start gap-6 w-full relative ">
            <ResumeSideBar />

<div id="skills" className="scroll-mt-[100px] w-full">

            <ResumeTitle title={strings.skills}  />
            {skillsData.map((data, i) => (
              <SkillItem key={i + data["en-GB"]} data={data} />
            ))}
</div>

<div id="experience" className="scroll-mt-[100px] w-full">

            <ResumeTitle title={strings.experience} />
            {experiencesData.map((data, i) => (
              <ExperienceItem key={i + data.companyName} data={data} />
            ))}
</div>
<div id="education" className="scroll-mt-[100px] w-full">

            <ResumeTitle title={strings.education}  />
            {educationData.map((data) => (
              <EducationItem key={data.name} data={data} />
            ))}
</div>
<div id="links" className="scroll-mt-[100px] w-full">

            <ResumeTitle title={strings.links} />
            {linkData.map((data) => (
              <LinkData key={data.title[lang]} data={data} />
            ))}
            </div>
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
  activeSection
}: {
  title: string;
  id: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  activeSection?: "toTop" | "skills" | "experience" | "education" | "links";
}) => {
  const isActive = activeSection === id;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
   if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group lg:pl-3 pl-2 lg:pr-1 pr-0 transition-all lg:rounded-r-none rounded
        ${isActive ? 'lg:dark:bg-white/20 lg:bg-slate-950/20' : ''}`}
    >
      <div className={`flex items-center gap-1 transition-all
        ${isActive ? '-translate-x-1' : 'group-hover:-translate-x-1'}`}
      >
        <span className="lg:block hidden">{title}</span>
        <Icon className="lg:h-4 h-6 lg:m-0 m-1" />
      </div>
    </button>
  );
};

const ResumeTitle = ({ title,  }: { title: string;  }) => (
  <div className="w-full text-start fade-in relative">
    <div  className="absolute -top-[100px]" />
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

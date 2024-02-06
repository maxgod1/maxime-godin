import projectsData from "../../../database/projectsData";
import ProjectItem from "../_components/ProjectItem";

export default async function Project() {
  return (
    <div className="w-full flex flex-col items-center gap-8 px-3">
      {projectsData
        .map<React.ReactNode>((p, i) => <ProjectItem key={p.title} index={i} data={p} />)
        .reduce((prev, curr) => [
          prev,
          <div className="flex w-full max-w-[1000px]">
            <div className="h-[3px] w-1/2 bg-gradient-to-r  to-black/20 from-black/0 dark:to-white/20 dark:from-white/0" />
            <div className="h-[3px] w-1/2 bg-black/20 dark:bg-white/20" />
            <div className="h-[3px] w-1/2 bg-gradient-to-r  from-black/20 to-black/0 dark:from-white/20 dark:to-white/0" />
          </div>,
          curr,
        ])}
    </div>
  );
}

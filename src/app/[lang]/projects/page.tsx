import projectsData from "../../../database/projectsData";
import ProjectItem from "../_components/ProjectItem";

export default async function Project() {
  return (
    <div className="w-full flex flex-col items-center gap-8 lg:px-3">
      {projectsData
        .map<React.ReactNode>((p, i) => <ProjectItem key={p.title} index={i} data={p} />)
        .reduce((prev, curr) => [
          prev,
          <div key={prev?.toString()} className="flex w-full max-w-[1000px]">
            <div className="h-[2px] lg:w-1/3 w-1/2 bg-gradient-to-r  to-white/50 from-black/0 dark:to-black/30 dark:from-black/0" />
            <div className="h-[2px] lg:w-1/3 w-1/2 bg-white/50 dark:bg-black/30" />
            <div className="h-[2px] lg:w-1/3 w-1/2 bg-gradient-to-r  from-white/50 to-black/0 dark:from-black/30 dark:to-black/0" />
          </div>,
          curr,
        ])}
    </div>
  );
}

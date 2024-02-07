import { useRef } from "react";
import projectsData from "../../../database/projectsData";
import { useIsVisible } from "../../../hooks/ElementVisible";
import ProjectItem from "./_components/ProjectItem";
import Divider from "./_components/Divider";

export default async function Project() {
  return (
    <div className="w-full flex flex-col items-center gap-8 lg:px-3">
      {projectsData
        .map<React.ReactNode>((p, i) => <ProjectItem key={p.title} index={i} data={p} />)
        .reduce((prev, curr) => [prev, <Divider key={prev?.toString()} />, curr])}
    </div>
  );
}

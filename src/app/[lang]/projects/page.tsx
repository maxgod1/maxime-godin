import projectsData from "../../../database/projectsData";
import ProjectItem from "../../components/project/ProjectItem";
import Divider from "../../components/project/Divider";

export default async function Project() {
  return (
    <div className="w-full flex flex-col items-center gap-8 lg:px-3">
      {projectsData
        .map<React.ReactNode>((p, i) => <ProjectItem key={p.title} index={i} data={p} />)
        .reduce((prev, curr) => [prev, <Divider key={prev?.toString()} />, curr])}
    </div>
  );
}

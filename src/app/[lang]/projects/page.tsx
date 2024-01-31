import projects from "../../../utils/data/projects";
import ProjectItem from "../_components/ProjectItem";

export default async function Project() {
  return (
    <div className="w-full flex flex-col items-center gap-8 px-3">
      {projects.map((p, i) => (
        <ProjectItem key={p.title} index={i} data={p} />
      ))}
    </div>
  );
}

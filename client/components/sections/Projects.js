import Panel from '../ui/Panel';
import Image from 'next/image';
import { FolderKanban, Github, ExternalLink } from 'lucide-react';
import api from '../../lib/api';

async function getProjects() {
  try {
    const { data } = await api.get('/projects');
    return data;
  } catch {
    return [];
  }
}

export default async function Projects() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <Panel id="projects" label="PROJECTS.log" icon={<FolderKanban size={14} />}>
        <p className="font-mono text-sm text-muted">
          // aucun projet publié pour l'instant
        </p>
      </Panel>
    );
  }

  return (
    <Panel id="projects" label="PROJECTS.log" title="Projets" icon={<FolderKanban size={14} />}>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => {
          const coverImage = project.media?.find((m) => m.type === 'IMAGE');
          return (
            <article
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-panel-border bg-bg transition-all duration-300 hover:-translate-y-1 hover:border-vision hover:shadow-xl hover:shadow-vision/10"
            >
              {coverImage && (
                <div className="relative h-40 w-full overflow-hidden border-b border-panel-border">
                  <Image
                    src={coverImage.url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-white">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{project.description}</p>

                {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-panel-border px-2 py-1 font-mono text-xs text-vision"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-4 font-mono text-xs">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-muted transition-colors hover:text-vision"
                    >
                      <Github size={14} /> repo
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-muted transition-colors hover:text-vision"
                    >
                      <ExternalLink size={14} /> demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

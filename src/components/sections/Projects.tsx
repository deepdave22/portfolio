import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { ExternalIcon, GitHubIcon } from "@/components/Icons";
import { projects, sections, type Project } from "@/data/portfolio";

/** A "#" or empty link means the URL isn't public yet. */
const isPlaceholder = (href?: string) => !href || href === "#";

function TechTags({ tech, accent }: { tech: string[]; accent?: boolean }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {tech.map((item) => (
        <li key={item} className={accent ? "tag tag-accent" : "tag"}>
          {item}
        </li>
      ))}
    </ul>
  );
}

const linkClass =
  "btn inline-flex items-center gap-2 rounded-lg border border-line-strong px-3.5 py-2 font-display text-sm font-medium hover:border-accent hover:text-accent-ink";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {isPlaceholder(project.github) ? (
        <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line px-3.5 py-2 font-display text-sm text-muted">
          <GitHubIcon className="size-4" />
          Repo not public yet
        </span>
      ) : (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <GitHubIcon className="size-4" />
          <span>
            View code
            <span className="sr-only"> for {project.title} on GitHub</span>
          </span>
        </a>
      )}

      {!isPlaceholder(project.demo) ? (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <ExternalIcon className="size-4" />
          <span>
            Open live demo
            <span className="sr-only"> of {project.title}</span>
          </span>
        </a>
      ) : null}
    </div>
  );
}

function StatusPill({ status, accent }: { status: string; accent?: boolean }) {
  return (
    <span
      className={`t-data rounded-full border px-2.5 py-0.5 ${
        accent
          ? "border-accent/35 text-accent-ink"
          : "border-line text-muted"
      }`}
    >
      {status}
    </span>
  );
}

/** Featured projects render as wide cards above the standard grid. */
export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section id="projects" {...sections.projects}>
      {featured.length > 0 ? (
        <ul className="mb-6 grid gap-6">
          {featured.map((project, i) => (
            <Reveal as="li" key={project.id} delay={i * 0.05} className="block">
              <article data-spotlight className="fx-card relative overflow-hidden rounded-2xl border border-accent/30 bg-accent-soft p-6 sm:p-9 lg:p-10">
                {/* Two columns from lg: the pitch on the left, the spec on the
                    right, so the card carries the full width. */}
                <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="t-h3 text-accent-ink">{project.title}</h3>
                      {project.status ? (
                        <StatusPill status={project.status} accent />
                      ) : null}
                    </div>

                    <p className="t-body measure mt-4">{project.description}</p>

                    <TechTags tech={project.tech} accent />
                    <ProjectLinks project={project} />
                  </div>

                  {project.highlights?.length ? (
                    <dl className="grid grid-cols-1 gap-px self-start overflow-hidden rounded-xl border border-accent/25 bg-accent/20 sm:grid-cols-3 lg:grid-cols-1">
                      {project.highlights.map((h) => (
                        <div
                          key={h.label}
                          className="flex items-baseline justify-between gap-4 bg-bg px-4 py-3.5 sm:block lg:flex"
                        >
                          <dt className="t-data-sm text-muted">{h.label}</dt>
                          <dd className="font-display text-sm font-semibold sm:mt-1 lg:mt-0">
                            {h.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      ) : null}

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((project, i) => (
          <Reveal as="li" key={project.id} delay={i * 0.05} className="block">
            <article data-spotlight className="fx-card flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="t-h4">{project.title}</h3>
                {project.status ? <StatusPill status={project.status} /> : null}
              </div>

              <p className="t-small mt-3 flex-1">{project.description}</p>

              <TechTags tech={project.tech} />
              <ProjectLinks project={project} />
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

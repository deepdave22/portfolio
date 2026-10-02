import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { experience, sections } from "@/data/portfolio";

/**
 * Vertical timeline — one rail, a node per role, newest first. This is the one
 * place on the page where sequence is real, so it is the one place that gets
 * ordered markers.
 *
 * From lg each entry splits into a metadata column (dates, location, stack) and
 * a narrative column, so a wide screen carries information instead of margin.
 */
export default function Experience() {
  return (
    <Section id="experience" {...sections.experience}>
      <ol className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-10 w-px bg-line"
        />

        {/* Spacing lives on the <li>, not the <article>: the article is the only
            child of its list item, so `last:` there matched every entry and
            collapsed the gap between roles to zero. */}
        {experience.map((role, i) => (
          <Reveal
            as="li"
            key={role.company}
            delay={i * 0.05}
            className="block pb-14 last:pb-0"
          >
            <article className="fx-entry relative pl-8 sm:pl-10">
              <span
                aria-hidden="true"
                className={`fx-node absolute left-0 top-2 size-[15px] rounded-full border-2 ${
                  role.current
                    ? "live-dot border-accent bg-accent"
                    : "border-line-strong bg-bg"
                }`}
              />

              <div className="grid gap-x-12 gap-y-5 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
                <div className="lg:pt-1">
                  <p className="t-data text-muted">
                    {role.start} to {role.end}
                  </p>
                  <p className="t-data mt-1 text-muted">{role.location}</p>
                  {role.current ? (
                    <span className="t-data mt-3 inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 text-accent-ink">
                      Current role
                    </span>
                  ) : null}

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {role.stack.map((tech) => (
                      <li key={tech} className="tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="t-h3 fx-entry-title">{role.title}</h3>
                  <p className="mt-1 font-display text-base font-medium text-accent-ink">
                    {role.company}
                  </p>

                  <p className="t-body measure mt-4">{role.summary}</p>

                  <ul className="measure mt-4 space-y-3">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="relative pl-5">
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-[0.7rem] size-1.5 rounded-full bg-accent/70"
                        />
                        <span className="t-body">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

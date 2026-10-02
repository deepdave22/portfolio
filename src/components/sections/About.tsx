import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { education, person, sections } from "@/data/portfolio";

/** The narrative that turns a list of jobs into a direction of travel. */
export default function About() {
  const journey = person.journey;

  return (
    <Section id="about" {...sections.about}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
        <div className="space-y-6">
          {person.about.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="t-body measure">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div data-spotlight className="fx-card rounded-2xl border border-line bg-bg-elev p-7">
            <h3 className="t-h4">How I got here</h3>

            <ol className="mt-6 space-y-6">
              {journey.map((step, i) => {
                const isNow = i === journey.length - 1;
                return (
                  <li key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className={`mt-2 size-2.5 shrink-0 rounded-full ${
                          isNow ? "bg-accent" : "bg-line-strong"
                        }`}
                      />
                      {i < journey.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="mt-1.5 w-px flex-1 bg-line"
                        />
                      ) : null}
                    </div>
                    <div className="-mt-0.5 pb-1">
                      <p className="t-data text-muted">{step.year}</p>
                      <p className="mt-1 font-display text-sm font-semibold">
                        {step.label}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="t-small mt-7 border-t border-line pt-6">
              {education.degree} in {education.field}, {education.period}.
              Based in {person.location}.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

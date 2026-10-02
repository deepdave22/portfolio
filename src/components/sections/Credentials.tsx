import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { CapIcon, CertIcon } from "@/components/Icons";
import { certifications, education, sections } from "@/data/portfolio";

/**
 * Certifications and education share one section: both answer "what's on
 * paper?", and pairing them keeps the page from sagging into two thin strips.
 */
export default function Credentials() {
  return (
    <Section id="certifications" {...sections.credentials}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h3 className="t-h4">Certifications</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {certifications.map((cert, i) => (
              <Reveal as="li" key={cert.name} delay={i * 0.04} className="block">
                <div data-spotlight className="fx-card flex h-full items-start gap-3.5 rounded-xl border border-line bg-bg-elev px-4 py-4">
                  <CertIcon
                    className="mt-0.5 size-4 shrink-0 text-accent-ink"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold leading-snug">
                      {cert.name}
                    </p>
                    <p className="t-data mt-1.5 text-muted">
                      {cert.issuer}
                      {cert.year ? `, ${cert.year}` : ""}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <div id="education" className="scroll-mt-24">
          <h3 className="t-h4">Education</h3>
          <Reveal delay={0.06}>
            <div data-spotlight className="fx-card mt-6 rounded-2xl border border-line bg-bg-elev p-7">
              <CapIcon className="size-5 text-accent-ink" aria-hidden="true" />
              <h4 className="t-h3 mt-4">
                {education.degree} in {education.field}
              </h4>
              <p className="t-small mt-3">{education.institution}</p>
              <p className="t-small mt-1">{education.university}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                <span className="tag">{education.period}</span>
                <span className="tag tag-accent">{education.grade}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { sections, skillGroups } from "@/data/portfolio";

/**
 * Skills as an editorial list rather than a grid of identical cards.
 *
 * Four equal cards give four clusters equal visual weight, which is exactly
 * wrong here — the AI/ML group is the argument the whole site is making, and
 * the analytics group is supporting evidence. A row per group, split into a
 * label column and a tag column, lets the primary row take accent treatment
 * and keeps every group scannable at a glance.
 *
 * There are deliberately no proficiency bars or percentages: they would be
 * numbers nobody measured.
 */
export default function Skills() {
  return (
    <Section id="skills" {...sections.skills}>
      <ul className="border-t border-line">
        {skillGroups.map((group, i) => (
          <Reveal
            as="li"
            key={group.title}
            delay={i * 0.05}
            className="block border-b border-line"
          >
            <div
              className={`fx-row grid gap-x-12 gap-y-5 py-8 pl-4 pr-4 sm:py-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] ${
                group.primary
                  ? "border-l-2 border-accent bg-accent-soft/50 pl-5"
                  : ""
              }`}
            >
              <div>
                <h3
                  className={`t-h3 ${group.primary ? "text-accent-ink" : ""}`}
                >
                  {group.title}
                </h3>
                <p className="t-small mt-2">{group.caption}</p>
              </div>

              <ul className="flex flex-wrap content-start gap-2">
                {group.skills.map((skill, n) => (
                  <li
                    key={skill}
                    style={{ "--i": n } as CSSProperties}
                    className={
                      group.primary
                        ? "tag tag-accent tag-cascade"
                        : "tag tag-cascade"
                    }
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

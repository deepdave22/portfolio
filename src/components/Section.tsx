import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionProps {
  id: string;
  /** Section headline. */
  title: string;
  /** Optional sentence under the headline. */
  intro?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Shared section shell: hairline rule, headline, body.
 *
 * There is deliberately no numbered eyebrow here. Numbered markers belong on
 * content that is genuinely a sequence — the experience timeline is, a list of
 * page sections is not, and the nav already handles wayfinding.
 *
 * Every section renders through this, so the heading size and the vertical
 * rhythm are identical down the whole page.
 */
export default function Section({
  id,
  title,
  intro,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`border-t border-line ${className}`}
    >
      <div className="container-page section-y">
        <Reveal>
          <h2 id={`${id}-heading`} className="t-h2 text-balance">
            {title}
          </h2>
          {intro ? <p className="t-lead measure mt-4">{intro}</p> : null}
        </Reveal>

        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}

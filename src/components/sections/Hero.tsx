import type { CSSProperties } from "react";
import Avatar from "@/components/Avatar";
import { LazyRelevanceField } from "@/components/LazyEffects";
import { DownloadIcon, MailIcon } from "@/components/Icons";
import { contact, person, resumeHref } from "@/data/portfolio";

/** Stagger delay for the entrance, in seconds (read by `.rise` in interactions.css). */
const delay = (d: number) => ({ "--d": d }) as CSSProperties;

/**
 * The 30-second pitch: who, what he builds, and two ways to act on it. The
 * portrait anchors the right column so the page opens with a face rather than
 * a wall of text.
 *
 * Deliberately no scroll-reveal in here. The hero is above the fold on every
 * screen, so a scroll-triggered reveal only delays the largest contentful paint
 * behind hydration (it measured LCP 6.1s on throttled mobile). The entrance
 * below is pure CSS, runs from first paint, and needs no JavaScript.
 */
export default function Hero() {
  const stats = [...person.stats, { value: person.location, label: "Based in" }];

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <LazyRelevanceField />
        <div className="bg-columns absolute inset-0" />
        {/* The two retrieval paths, converging behind the headline */}
        <div className="absolute -left-20 -top-32 size-[38rem] rounded-full bg-semantic opacity-[0.10] blur-[120px]" />
        <div className="absolute -right-20 top-10 size-[32rem] rounded-full bg-lexical opacity-[0.09] blur-[120px]" />
        {/* Scrim: keeps the headline and pitch fully legible over the field,
            while the texture stays visible past the text column. */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-bg via-bg/80 to-transparent lg:w-[64%]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="container-page grid items-center gap-x-16 gap-y-12 pb-20 pt-14 sm:pt-20 lg:min-h-[86vh] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pb-28">
        <div>
          <p className="t-small rise flex items-center gap-2.5" style={delay(0)}>
            <span
              aria-hidden="true"
              className="live-dot size-2 shrink-0 rounded-full bg-semantic"
            />
            {contact.availability}
          </p>

          <h1 className="t-display rise mt-5" style={delay(0.04)}>
            {person.name}
            <span className="mt-1.5 block text-accent-ink">{person.title}</span>
          </h1>

          <p className="t-small rise mt-4" style={delay(0.08)}>
            {person.focus.join(", ")}
          </p>

          <p className="t-lead measure rise mt-7" style={delay(0.1)}>
            {person.pitch}
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={delay(0.14)}
          >
            <a
              href="#projects"
              data-magnetic
              className="btn btn-primary inline-flex items-center rounded-lg bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-contrast"
            >
              View projects
            </a>
            <a
              href={resumeHref}
              download
              data-magnetic
              className="btn inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 font-display text-sm font-semibold hover:border-accent hover:text-accent-ink"
            >
              <DownloadIcon className="size-4" />
              Download resume
            </a>
            <a
              href="#contact"
              className="btn inline-flex items-center gap-2 rounded-lg px-3 py-2.5 font-display text-sm font-semibold text-muted hover:text-fg"
            >
              <MailIcon className="size-4" />
              Get in touch
            </a>
          </div>
        </div>

        {/* Portrait: tilts toward the pointer, eyes follow it (Interactions.tsx) */}
        <div className="rise order-first lg:order-none" style={delay(0.1)}>
          <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-[20rem] lg:max-w-none">
            <div
              data-tilt
              className="tilt relative aspect-square overflow-hidden rounded-[1.75rem] border border-line bg-bg-elev p-4 shadow-[var(--shadow)]"
            >
              <Avatar />
            </div>
          </div>
        </div>

        {/* Facts strip spans the full width so both columns sit on it */}
        <div className="rise lg:col-span-2" style={delay(0.2)}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-bg px-5 py-4 transition-colors duration-300 hover:bg-bg-elev"
              >
                <dt className="t-data-sm text-muted">{stat.label}</dt>
                <dd className="mt-1.5 font-display text-lg font-semibold tracking-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

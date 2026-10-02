"use client";

import { useState, type FormEvent } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { socialIcons } from "@/components/Icons";
import { contact, email, socials } from "@/data/portfolio";

const isPlaceholder = (href: string) => !href || href === "#";

/**
 * Contact form with no backend: submitting composes a mailto: link and hands
 * off to the visitor's mail client. Nothing is stored or sent anywhere.
 */
export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const from = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const subject = `${contact.subjectPrefix} from ${name || "a visitor"}`;
    const body = `${message}\n\n—\n${name}\n${from}`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent";
  const labelClass = "block font-display text-sm font-medium text-fg-dim";

  return (
    <Section id="contact" title={contact.heading} intro={contact.blurb}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <h3 className="t-h4">Find me</h3>
          <ul className="mt-6 space-y-2.5">
            {socials.map((social) => {
              const Icon = socialIcons[social.id];
              const shared =
                "flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors";

              if (isPlaceholder(social.href)) {
                return (
                  <li key={social.id}>
                    <div
                      className={`${shared} border-dashed border-line text-muted`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="font-display text-sm font-medium">
                        {social.label}
                      </span>
                      <span className="t-data ml-auto">not linked yet</span>
                    </div>
                  </li>
                );
              }

              return (
                <li key={social.id}>
                  <a
                    href={social.href}
                    {...(/^https?:/i.test(social.href)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    data-spotlight
                    className={`${shared} fx-card border-line bg-bg-elev`}
                  >
                    <Icon className="size-4 shrink-0 text-accent-ink" />
                    <span className="font-display text-sm font-medium">
                      {social.label}
                    </span>
                    <span className="t-data ml-auto truncate text-muted">
                      {social.handle}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal delay={0.08}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line bg-bg-elev p-7"
          >
            <h3 className="t-h4">Send a message</h3>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={fieldClass}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  className={`${fieldClass} resize-y`}
                  placeholder="What are you working on?"
                />
              </div>
            </div>

            <button
              type="submit"
              data-magnetic
              className="btn btn-primary mt-7 inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-contrast sm:w-auto"
            >
              Open in mail app
            </button>

            <p className="t-small mt-4" role="status">
              {sent
                ? `Your mail app should be open. If nothing happened, write to ${email} directly.`
                : "This opens your own email client. Nothing is sent or stored by this site."}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

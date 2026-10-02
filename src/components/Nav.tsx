"use client";

import { useEffect, useState } from "react";
import { navItems, person } from "@/data/portfolio";
import { CloseIcon, MenuIcon } from "./Icons";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

/**
 * Sticky header with active-section highlighting.
 *
 * Active state comes from an IntersectionObserver over the section elements
 * rather than a scroll listener, so it costs nothing on the main thread.
 */
export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-16 items-center justify-between gap-4"
      >
        <a
          href="#top"
          aria-label={`${person.name}, back to top`}
          className="logo group flex items-center gap-2.5"
        >
          <Logo />
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">
            {person.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`nav-link relative block rounded-lg px-3 py-1.5 font-display text-sm font-medium transition-colors ${
                    isActive ? "text-accent-ink" : "text-muted hover:text-fg"
                  }`}
                >
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg bg-accent-soft"
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-fg md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-bg md:hidden"
      >
        <ul className="container-page flex flex-col py-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? "true" : undefined}
                className={`block border-b border-line py-3.5 font-display text-sm font-medium last:border-b-0 ${
                  active === item.id ? "text-accent-ink" : "text-fg-dim"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

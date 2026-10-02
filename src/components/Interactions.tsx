"use client";

import { useEffect, useRef } from "react";

/**
 * The page's whole pointer-reactive layer, behind one delegated listener.
 *
 * What it drives (the visuals live in interactions.css):
 *   - a scroll-progress bar
 *   - a cursor ring + dot that swell over links, buttons and form fields
 *   - an ambient glow that trails the pointer across the page
 *   - the spotlight inside any [data-spotlight] card
 *   - magnetic pull on any [data-magnetic] element
 *   - the portrait's tilt and eye-tracking on any [data-tilt] element
 *
 * Performance rules, because mobile Lighthouse is the tightest number here:
 *   - nothing is measured at mount (a forced layout during hydration cost
 *     ~350ms of blocking time the last time that happened)
 *   - pointermove only records the position and schedules ONE requestAnimationFrame;
 *     the frame loop stops itself the moment everything has settled
 *   - the cursor effects, glow, magnetism and tilt exist only for a fine pointer
 *     (mouse, trackpad, pen) and are skipped entirely under reduced motion
 *   - the scroll bar is the one thing touch users get; it is a single transform
 */

const INTERACTIVE = 'a, button, summary, label[for], [role="button"], [data-cursor]';
const TEXTUAL = "input, textarea, select";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function Interactions() {
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    const glow = glowRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!progress || !glow || !ring || !dot) return;

    /* ── Scroll progress: every device ─────────────────────────────────────── */

    let scrollQueued = false;
    const paintProgress = () => {
      scrollQueued = false;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      progress.style.transform = `scaleX(${max > 0 ? clamp(root.scrollTop / max, 0, 1) : 0})`;
    };
    const onScroll = () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(paintProgress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    /* ── Pointer effects: fine pointers only, never under reduced motion ──── */

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cleanupScroll = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    if (!fine || reduce) return cleanupScroll;

    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const tiltEl = document.querySelector<HTMLElement>("[data-tilt]");
    let tiltVisible = true;
    const tiltObserver = new IntersectionObserver(
      ([entry]) => {
        tiltVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    if (tiltEl) tiltObserver.observe(tiltEl);

    // Pointer, and the lagging positions the ring and glow chase.
    let mx = 0;
    let my = 0;
    let ringX = 0;
    let ringY = 0;
    let glowX = 0;
    let glowY = 0;
    let target: Element | null = null;
    let shown = false;
    let frame = 0;
    let state = "";
    let lastSpot: HTMLElement | null = null;

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const setState = (next: string) => {
      if (next === state) return;
      state = next;
      if (next) ring.dataset.state = next;
      else delete ring.dataset.state;
    };

    const tick = () => {
      frame = 0;

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ringX += (mx - ringX) * 0.22;
      ringY += (my - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      glowX += (mx - glowX) * 0.07;
      glowY += (my - glowY) * 0.07;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;

      // Spotlight: write the pointer position into the card under the cursor.
      const spot = target?.closest<HTMLElement>("[data-spotlight]") ?? null;
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--x", `${mx - r.left}px`);
        spot.style.setProperty("--y", `${my - r.top}px`);
      }
      lastSpot = spot;

      // Magnetic pull toward the cursor, only when it is close.
      for (const el of magnets) {
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        // A gentle tug, not a grab: roughly 6px at most.
        const reach = Math.max(r.width, r.height) * 0.6 + 28;
        if (dist < reach) {
          const pull = (1 - dist / reach) * 0.25;
          el.style.translate = `${(dx * pull).toFixed(1)}px ${(dy * pull).toFixed(1)}px`;
        } else if (el.style.translate) {
          el.style.translate = "";
        }
      }

      // Portrait: tilt and eye-tracking follow the pointer from anywhere on the page.
      if (tiltEl && tiltVisible) {
        const r = tiltEl.getBoundingClientRect();
        const nx = clamp((mx - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
        const ny = clamp((my - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
        tiltEl.style.setProperty("--tx", nx.toFixed(3));
        tiltEl.style.setProperty("--ty", ny.toFixed(3));
        tiltEl.style.setProperty("--gx", `${((mx - r.left) / r.width) * 100}%`);
        tiltEl.style.setProperty("--gy", `${((my - r.top) / r.height) * 100}%`);
      }

      // Keep animating only while the trailing ring or glow is still catching up.
      if (
        Math.abs(mx - ringX) > 0.3 ||
        Math.abs(my - ringY) > 0.3 ||
        Math.abs(mx - glowX) > 0.5 ||
        Math.abs(my - glowY) > 0.5
      ) {
        schedule();
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mx = e.clientX;
      my = e.clientY;
      target = e.target as Element | null;

      if (!shown) {
        shown = true;
        // First movement: start the trailing elements at the pointer, not at 0,0.
        ringX = glowX = mx;
        ringY = glowY = my;
        ring.dataset.on = dot.dataset.on = glow.dataset.on = "true";
      }

      if (target?.closest(TEXTUAL)) setState("text");
      else if (target?.closest(INTERACTIVE)) setState("link");
      else setState("");

      schedule();
    };

    const onLeave = () => {
      shown = false;
      delete ring.dataset.on;
      delete dot.dataset.on;
      delete glow.dataset.on;
      for (const el of magnets) el.style.translate = "";
      if (tiltEl) {
        tiltEl.style.setProperty("--tx", "0");
        tiltEl.style.setProperty("--ty", "0");
      }
      if (lastSpot) lastSpot = null;
    };

    const onDown = () => {
      ring.dataset.press = "true";
    };
    const onUp = () => {
      delete ring.dataset.press;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cleanupScroll();
      cancelAnimationFrame(frame);
      tiltObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={progressRef} className="fx-progress" aria-hidden="true" />
      <div ref={glowRef} className="fx-glow" aria-hidden="true" />
      <div ref={ringRef} className="fx-ring" aria-hidden="true">
        <i />
      </div>
      <div ref={dotRef} className="fx-dot" aria-hidden="true" />
    </>
  );
}

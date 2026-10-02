"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's background motif: a field of ranked, scored results.
 *
 * Drifting neural-network nodes are the default backdrop for anything labelled
 * "AI", so this draws what Deep actually builds instead. Each bar is a retrieval
 * candidate; its length is its relevance score. Teal bars came from the semantic
 * search, amber from the keyword search — the two halves of a hybrid retriever.
 * Every few seconds the set is re-scored and the bars ease to new lengths, which
 * is what reranking looks like.
 *
 * It is ambient decoration, so it is built to cost almost nothing:
 *  - the first frame is drawn statically, so the page looks finished immediately
 *  - animation only starts well after the page has loaded, never during hydration
 *  - it animates for ~1s per cycle, at 24fps, then sleeps on a timer (no rAF loop)
 *  - bars are drawn in a handful of batched fills rather than one per bar
 *  - it pauses off-screen and on hidden tabs, and stays static under reduced motion
 *
 * The earlier version redrew every bar at 60fps almost continuously. A trace
 * showed that function alone cost ~2s of main-thread time under mobile CPU
 * throttling — so this one earns its keep.
 */

interface Bar {
  row: number;
  col: number;
  from: number;
  to: number;
  /** Extra length from the pointer being nearby, 0 when it is not. */
  boost: number;
  lexical: boolean;
}

const ROW_HEIGHT = 22;
const BAR_THICKNESS = 3;
const ALPHA_STEPS = 8;
const ALPHA_MIN = 0.035;
const ALPHA_RANGE = 0.14;

const ANIMATE_MS = 1000; // one rerank settles in about a second
const HOLD_MS = 4200; // then the field rests
const FRAME_MS = 1000 / 24; // ambient motion doesn't need 60fps
const START_DELAY_MS = 1500; // after load, so it never competes with hydration

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export default function RelevanceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let columns = 3;
    let bars: Bar[] = [];
    let frame = 0;
    let timer = 0;
    let startTimer = 0;
    let running = true;
    let animStart = 0;
    let lastDraw = 0;
    let progressT = 1; // how far the current rerank has eased, 0..1
    let cycling = false; // true while a rerank cycle is animating

    // Pre-built fill styles: [colour][alpha step]. Built once per theme change,
    // not once per bar per frame.
    let styles: string[][] = [[], []];
    // Reused every frame so drawing allocates nothing.
    const groups: number[][][] = [
      Array.from({ length: ALPHA_STEPS }, () => []),
      Array.from({ length: ALPHA_STEPS }, () => []),
    ];

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      const rgb = (prop: string, fallback: string) => {
        const hex = style.getPropertyValue(prop).trim().replace("#", "");
        if (hex.length !== 6) return fallback;
        const n = parseInt(hex, 16);
        return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
      };
      const semantic = rgb("--semantic", "43, 179, 163");
      const lexical = rgb("--lexical", "232, 163, 61");
      styles = [semantic, lexical].map((c) =>
        Array.from(
          { length: ALPHA_STEPS },
          (_, i) =>
            `rgba(${c}, ${ALPHA_MIN + ((i + 0.5) / ALPHA_STEPS) * ALPHA_RANGE})`,
        ),
      );
    }

    /** Scores decay down the ranking, the way real result lists do. */
    function score(row: number, rows: number) {
      const rank = row / Math.max(1, rows);
      return (1 - rank) ** 1.5 * (0.55 + Math.random() * 0.45);
    }

    /**
     * Sizes the canvas and generates the bars. The size is *given*, not measured:
     * calling getBoundingClientRect() here forced a synchronous full-page layout
     * in the middle of React's post-hydration effect flush, a ~350ms long task
     * that landed inside the measurement window on about a third of Lighthouse
     * runs. A ResizeObserver reports the size after the browser has laid the
     * page out on its own schedule, so it costs nothing extra.
     */
    function build(w: number, h: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w;
      height = h;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = width < 640 ? 2 : 3;
      const rows = Math.ceil(height / ROW_HEIGHT) + 1;
      bars = [];
      for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
          const s = score(row, rows);
          bars.push({ row, col, from: s, to: s, boost: 0, lexical: Math.random() > 0.5 });
        }
      }
    }

    /** Draw every bar at animation progress `t` (0 = old scores, 1 = new). */
    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const colWidth = width / columns;
      const maxLen = colWidth * 0.62;
      const e = ease(t);

      for (const g of groups) for (const list of g) list.length = 0;

      for (const bar of bars) {
        const w = Math.min(1.15, bar.from + (bar.to - bar.from) * e + bar.boost);
        const step = Math.min(ALPHA_STEPS - 1, Math.floor(w * ALPHA_STEPS));
        groups[bar.lexical ? 1 : 0][step].push(
          bar.col * colWidth + colWidth * 0.12,
          bar.row * ROW_HEIGHT,
          Math.max(4, w * maxLen),
        );
      }

      // One fill per (colour, alpha step) — at most 16 — instead of one per bar.
      for (let c = 0; c < 2; c++) {
        for (let s = 0; s < ALPHA_STEPS; s++) {
          const list = groups[c][s];
          if (!list.length) continue;
          ctx!.beginPath();
          for (let i = 0; i < list.length; i += 3) {
            ctx!.rect(list[i], list[i + 1], list[i + 2], BAR_THICKNESS);
          }
          ctx!.fillStyle = styles[c][s];
          ctx!.fill();
        }
      }
    }

    function beginCycle() {
      if (!running || bars.length === 0) return;
      const rows = Math.ceil(height / ROW_HEIGHT) + 1;
      for (const bar of bars) {
        bar.from = bar.to;
        bar.to = score(bar.row, rows);
      }
      animStart = performance.now();
      lastDraw = 0;
      cycling = true;
      frame = requestAnimationFrame(tick);
    }

    function tick(now: number) {
      const t = Math.min(1, (now - animStart) / ANIMATE_MS);
      if (t === 1 || now - lastDraw >= FRAME_MS) {
        draw(t);
        lastDraw = now;
      }
      progressT = t;
      if (t === 1) cycling = false;
      if (t < 1 && running) {
        frame = requestAnimationFrame(tick);
      } else if (running) {
        // Settled. Sleep on a timer — no animation loop is held open.
        timer = window.setTimeout(beginCycle, HOLD_MS);
      }
    }

    /**
     * Pointer reactivity. Bars within REACH px of the cursor lengthen and
     * brighten, easing in and out. The loop starts on pointermove and ends a
     * moment after the pointer stops, so an idle page runs no animation at all.
     * Layout is read here (inside an input-driven frame), never at mount.
     */
    const REACH = 150;
    let px = -1e4;
    let py = -1e4;
    let hoverFrame = 0;
    let lastMove = 0;

    function hoverTick(now: number) {
      hoverFrame = 0;
      if (!running || bars.length === 0) return;

      const rect = canvas!.getBoundingClientRect();
      const lx = px - rect.left;
      const ly = py - rect.top;
      const inside =
        lx > -REACH && lx < rect.width + REACH && ly > -REACH && ly < rect.height + REACH;
      const colWidth = width / columns;
      const maxLen = colWidth * 0.62;

      let moving = false;
      for (const bar of bars) {
        let target = 0;
        if (inside) {
          const bx = bar.col * colWidth + colWidth * 0.12 + (bar.to * maxLen) / 2;
          const by = bar.row * ROW_HEIGHT + BAR_THICKNESS / 2;
          const d = Math.hypot(lx - bx, ly - by);
          if (d < REACH) target = (1 - d / REACH) ** 2 * 0.5;
        }
        const diff = target - bar.boost;
        if (Math.abs(diff) > 0.002) {
          bar.boost += diff * 0.2;
          moving = true;
        } else {
          bar.boost = target;
        }
      }

      // A rerank cycle that is animating already redraws every frame itself.
      if (!cycling) draw(progressT);

      if (moving || now - lastMove < 300) {
        hoverFrame = requestAnimationFrame(hoverTick);
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (reduceMotion || e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      lastMove = performance.now();
      if (!hoverFrame && running && bars.length > 0) {
        hoverFrame = requestAnimationFrame(hoverTick);
      }
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    function stop() {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(hoverFrame);
      hoverFrame = 0;
      window.clearTimeout(timer);
      window.clearTimeout(startTimer);
    }

    function resume() {
      if (reduceMotion || !running) return;
      stop();
      timer = window.setTimeout(beginCycle, 600);
    }

    readColors();

    if (!reduceMotion) {
      // Wait for the page to finish loading, then a beat more.
      const kickoff = () => {
        startTimer = window.setTimeout(beginCycle, START_DELAY_MS);
      };
      if (document.readyState === "complete") kickoff();
      else window.addEventListener("load", kickoff, { once: true });
    }

    const visibility = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden;
        if (running) resume();
        else stop();
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) resume();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // The first callback fires right after the initial layout and gives us the
    // size for the static first frame; later callbacks handle real resizes.
    let resizeTimer: number;
    let sized = false;
    const sizeObserver = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (w === 0 || h === 0) return;
      const apply = () => {
        build(w, h);
        draw(1);
      };
      if (!sized) {
        sized = true;
        apply();
      } else {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(apply, 180);
      }
    });
    sizeObserver.observe(canvas);

    const themeWatcher = new MutationObserver(() => {
      readColors();
      draw(1);
    });
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      running = false;
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      visibility.disconnect();
      sizeObserver.disconnect();
      themeWatcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}

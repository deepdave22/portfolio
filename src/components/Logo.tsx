/**
 * The "D" mark.
 *
 * A bold D whose bowl holds two ranked bars — amber for the keyword result,
 * teal for the semantic one, the same pairing the whole site is built on. It
 * draws itself in once on load. On hover the two bars swap lengths, which is a
 * tiny rerank: the top result and the runner-up trading places.
 *
 * Pure SVG + CSS (see `.logo-*` in globals.css): no JavaScript, so it costs
 * nothing at hydration. The matching favicon lives in src/app/icon.svg.
 */
export default function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={`logo-mark ${className}`}
    >
      <path
        className="logo-d"
        pathLength={1}
        d="M9.5 7.5H15.5C21 7.5 24.5 11.2 24.5 16C24.5 20.8 21 24.5 15.5 24.5H9.5Z"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        className="logo-bar logo-bar-1"
        x="13.2"
        y="12.1"
        width="7"
        height="2.2"
        rx="1.1"
        fill="var(--lexical)"
      />
      <rect
        className="logo-bar logo-bar-2"
        x="13.2"
        y="17.6"
        width="4.2"
        height="2.2"
        rx="1.1"
        fill="var(--semantic)"
      />
    </svg>
  );
}

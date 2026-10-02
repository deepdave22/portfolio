/**
 * Hero portrait.
 *
 * Renders `avatar.photo` when one is set in portfolio.ts; otherwise draws the
 * illustrated figure below. The illustration is hand-built in the site's own
 * palette and geometry rather than pulled from an illustration kit, so it reads
 * as part of the design instead of as filler.
 *
 * To switch to a real photograph: drop the file in /public and set
 * `avatar.photo` — nothing else changes.
 */

import { avatar, person } from "@/data/portfolio";

const SKIN = "#c68e5f";
const SKIN_SHADE = "#ad7749";
const HAIR = "#1d1712";
const SHIRT = "#1e6b63";
const SHIRT_DARK = "#17544e";

export default function Avatar() {
  if (avatar.photo) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */
      <img
        src={avatar.photo}
        alt={`${person.name}, ${person.title}`}
        width={440}
        height={440}
        className="size-full rounded-[1.75rem] object-cover"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Illustrated portrait of ${person.name}`}
      className="size-full"
    >
      <defs>
        <radialGradient id="av-bg" cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor="var(--semantic)" stopOpacity="0.30" />
          <stop offset="55%" stopColor="var(--semantic)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--lexical)" stopOpacity="0.14" />
        </radialGradient>
        <clipPath id="av-clip">
          <circle cx="100" cy="100" r="92" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="92" fill="url(#av-bg)" />
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="var(--line-strong)"
        strokeWidth="1.5"
      />

      <g clipPath="url(#av-clip)">
        {/* Torso */}
        <path
          d="M18 200c0-38 30-58 56-64h52c26 6 56 26 56 64z"
          fill={SHIRT}
        />
        {/* Collar opening */}
        <path
          d="M74 136c8 12 18 18 26 18s18-6 26-18c-8-4-16-6-26-6s-18 2-26 6z"
          fill={SHIRT_DARK}
        />
        {/* Neck */}
        <path d="M86 112h28v26c0 6-28 6-28 0z" fill={SKIN_SHADE} />
        {/* Head: drifts a hair toward the pointer, see .av-head */}
        <g className="av-head">
        <ellipse cx="100" cy="88" rx="35" ry="41" fill={SKIN} />
        {/* Ears */}
        <ellipse cx="64" cy="92" rx="6" ry="9" fill={SKIN_SHADE} />
        <ellipse cx="136" cy="92" rx="6" ry="9" fill={SKIN_SHADE} />
        {/* Hair */}
        <path
          d="M63 84c-2-28 16-44 37-44s39 16 37 44c-3-14-10-20-14-21-8 6-22 8-34 6-9-1-16-3-20-7-3 4-5 12-6 22z"
          fill={HAIR}
        />
        {/* Brows */}
        <path
          d="M78 79c4-3 11-3 15-1M107 78c4-2 11-2 15 1"
          stroke={HAIR}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Glasses — amber, the site's action colour */}
        <g
          fill="none"
          stroke="var(--lexical)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        >
          <rect x="72" y="85" width="24" height="19" rx="7" />
          <rect x="104" y="85" width="24" height="19" rx="7" />
          <path d="M96 93h8" />
          <path d="M72 92l-8 2M128 92l8 2" strokeLinecap="round" />
        </g>
        {/* Eyes: .av-pupils follows the pointer, .av-eye blinks */}
        <g className="av-pupils">
          <circle className="av-eye" cx="84" cy="94" r="2.6" fill={HAIR} />
          <circle className="av-eye" cx="116" cy="94" r="2.6" fill={HAIR} />
        </g>
        {/* Mouth */}
        <path
          d="M92 114c4 4 12 4 16 0"
          stroke={HAIR}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        </g>
      </g>

      {/* Three ranked bars, tying the portrait to the retrieval motif */}
      <g opacity="0.85">
        <rect x="150" y="34" width="34" height="4" rx="2" fill="var(--lexical)" />
        <rect x="150" y="44" width="24" height="4" rx="2" fill="var(--semantic)" />
        <rect x="150" y="54" width="15" height="4" rx="2" fill="var(--semantic)" opacity="0.6" />
      </g>
    </svg>
  );
}

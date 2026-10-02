/**
 * The only Framer Motion features the site uses: animate, and whileInView.
 * Kept in its own module so LazyMotion can pull it in with a dynamic import —
 * the ~100 KB of drag, layout and gesture code in the full `motion` bundle is
 * never shipped at all.
 */
import { domAnimation } from "framer-motion";

export default domAnimation;

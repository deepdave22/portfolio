"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * The background canvas and the pointer-interaction layer are pure decoration:
 * nothing on the page depends on them to be readable or usable. So their code is
 * kept out of the initial bundle and fetched only once the browser is idle after
 * hydration, which keeps the critical path to just what the first paint needs.
 *
 * (`ssr: false` is only allowed inside a Client Component, hence this wrapper.)
 */
const Field = dynamic(() => import("./RelevanceField"), { ssr: false });
const Interactions = dynamic(() => import("./Interactions"), { ssr: false });

/** Becomes true once the browser has nothing better to do (or after a ceiling). */
function useIdle() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    // Safari has no requestIdleCallback, so fall back to a short timer there.
    const idle = (window as { requestIdleCallback?: typeof requestIdleCallback })
      .requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(go, { timeout: 2500 });
      return () => cancelIdleCallback(id);
    }
    const id = window.setTimeout(go, 1200);
    return () => window.clearTimeout(id);
  }, []);
  return ready;
}

export function LazyRelevanceField() {
  return useIdle() ? <Field /> : null;
}

export function LazyInteractions() {
  return useIdle() ? <Interactions /> : null;
}

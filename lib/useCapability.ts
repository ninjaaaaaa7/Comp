'use client';

import { useState, useEffect } from 'react';

export interface Capability {
  can3D: boolean;
  reducedMotion: boolean;
}

// Extend navigator typings for non-standard APIs.
interface ExtendedNavigator extends Navigator {
  connection?: { saveData?: boolean };
}

function checkWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/** Returns true / false if ?3d=1 / ?3d=0 is in the URL, null otherwise. */
function get3DOverride(): boolean | null {
  if (typeof window === 'undefined') return null;
  const v = new URLSearchParams(window.location.search).get('3d');
  if (v === '1') return true;
  if (v === '0') return false;
  return null;
}

/**
 * SSR-safe capability detection hook.
 * Returns { can3D: false } on server; resolves to real values after mount.
 *
 * can3D requires ALL:
 *   WebGL2 + hardwareConcurrency ≥ 2 + viewport ≥ 768 px + !saveData + !reduced-motion
 *
 * URL overrides (testing only): ?3d=1 forces enable, ?3d=0 forces fallback.
 */
export function useCapability(): Capability {
  const [cap, setCap] = useState<Capability>({ can3D: false, reducedMotion: false });

  useEffect(() => {
    const nav = navigator as ExtendedNavigator;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const override = get3DOverride();

    if (override === false) {
      setCap({ can3D: false, reducedMotion });
      return;
    }

    const saveData     = nav.connection?.saveData === true;
    const concurrency  = navigator.hardwareConcurrency ?? 0;
    const wideViewport = window.innerWidth >= 768;

    const can3D =
      override === true ||
      (
        !reducedMotion &&
        !saveData &&
        checkWebGL2() &&
        concurrency >= 2 &&
        wideViewport
      );

    setCap({ can3D, reducedMotion });
  }, []);

  return cap;
}

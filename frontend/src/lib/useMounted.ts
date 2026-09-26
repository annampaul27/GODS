import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * React 19 / Next.js SSR-safe mount detection hook.
 * Avoids calling setState synchronously inside an effect, preventing cascading re-renders.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

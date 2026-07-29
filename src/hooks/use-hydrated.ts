import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and during the first client render (so the
 * server-rendered HTML and the initial client render always match),
 * then true on every render after hydration completes.
 *
 * Preferred over `useState(false)` + `useEffect(() => setTrue(), [])`
 * because it doesn't call setState from inside an effect, so it
 * doesn't trigger React's "setState synchronously within an effect
 * can trigger cascading renders" warning.
 */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
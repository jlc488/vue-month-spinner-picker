import * as vue from 'vue';

type MaybeUseId = { useId?: () => string };

// Fallback counter for Vue < 3.5, which has no useId().
let fallbackCounter = 0;

/**
 * Generate an id that stays identical between server render and client
 * hydration. Must be called during setup().
 *
 * Vue 3.5+ provides useId(), which is app-scoped and therefore SSR-safe.
 * Older versions fall back to a module-level counter — deterministic within
 * a client-only app, but not across SSR requests. Accessed off the namespace
 * so a named import never breaks on Vue 3.3/3.4.
 */
export function useComponentId(prefix = 'vmp'): string {
  const useId = (vue as MaybeUseId).useId;
  if (typeof useId === 'function') {
    return `${prefix}-${useId()}`;
  }
  return `${prefix}-${++fallbackCounter}`;
}

import { debounce } from "lodash";

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
): ((...args: Args) => void) & { cancel: () => void } {
  const debounced = debounce(callback, delay);
  return Object.assign(debounced, {
    cancel: () => debounced.cancel(),
  });
}
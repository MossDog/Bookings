import { debounce } from "lodash";

// No any, clean generic typing
export const useDebouncedCallback = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
) => {
  return debounce(fn, delay);
};
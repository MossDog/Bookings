import { debounce } from "lodash";

export const useDebouncedCallback = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
) => {
  const debounced = debounce(fn, delay);
  return debounced;
};
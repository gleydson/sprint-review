import { useCallback, useEffect, useRef } from 'react';

/**
 * Options for configuring the debounce behavior.
 * @template T - The type of arguments passed to the debounced function.
 */
interface DebounceOptions {
  /**
   * The time in milliseconds to wait before invoking the callback.
   * @remarks
   * This determines how long the hook waits after the last call before executing
   * the callback. Common values range from 300 to 1000ms depending on use case.
   * @example
   * ```typescript
   * { delay: 500 } // Waits 500ms before invoking
   * ```
   */
  delay: number;

  /**
   * Whether to invoke the callback immediately on the first call.
   * @default false
   * @remarks
   * If true, the callback is executed immediately on the first call in a series,
   * in addition to any trailing execution if `trailing` is also true.
   * @example
   * ```typescript
   * { delay: 500, leading: true } // Executes immediately and after 500ms
   * ```
   */
  leading?: boolean;

  /**
   * Whether to invoke the callback after the delay with the last arguments.
   * @default true
   * @remarks
   * If true, the callback is executed after the delay with the most recent arguments
   * passed to the debounced function. If false, only leading calls are executed (if enabled).
   * @example
   * ```typescript
   * { delay: 500, trailing: false } // Only leading calls execute (if leading is true)
   * ```
   */
  trailing?: boolean;
}

/**
 * A React hook that creates a debounced version of a callback function.
 * The returned function delays invocation of the provided callback until
 * after a specified delay has elapsed since the last time it was called.
 *
 * @template T - The type of arguments accepted by the callback function.
 * @param callback - The function to debounce. This function will be called with the arguments passed to the debounced function.
 * @param options - Configuration options for the debounce behavior.
 * @returns A debounced version of the callback function that can be called with the same arguments.
 *
 * @example
 * Basic usage with a search function:
 * ```typescript
 * function SearchComponent() {
 *   const handleSearch = (query: string) => {
 *     console.log(`Searching: ${query}`);
 *   };
 *   const debouncedSearch = useDebounceAction(handleSearch, { delay: 500 });
 *
 *   return <input onChange={(e) => debouncedSearch(e.target.value)} />;
 * }
 * ```
 *
 * @example
 * With leading and trailing options:
 * ```typescript
 * const debouncedLog = useDebounceAction(
 *   (message: string) => console.log(message),
 *   { delay: 1000, leading: true, trailing: true }
 * );
 * debouncedLog("test"); // Logs immediately and after 1000ms if no further calls
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: This hook is designed to accept any arguments
export function useDebounceAction<T extends any[]>(
  callback: (...args: T) => void,
  options: DebounceOptions,
) {
  const { delay, leading = false, trailing = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<T | null>(null);
  const isLeadingCall = useRef(true);

  const debounce = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      lastArgsRef.current = args;

      if (leading && isLeadingCall.current) {
        callback(...args);
        isLeadingCall.current = false;
      }

      if (trailing) {
        if (isLeadingCall.current && !leading) {
          isLeadingCall.current = false;
        }

        if (delay <= 0) {
          callback(...args);
          return;
        }

        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current && !isLeadingCall.current) {
            callback(...lastArgsRef.current);
          }
          timeoutRef.current = null;
          lastArgsRef.current = null;
          isLeadingCall.current = true;
        }, delay);
      }
    },
    [callback, delay, leading, trailing],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounce;
}

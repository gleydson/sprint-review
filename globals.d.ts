import type { IndexableType } from 'dexie';

declare module 'dexie' {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  export interface Table<T = any, TKey = IndexableType> {
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    with: (spec: Object) => Promise<T[]>;
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  export interface Collection<T = any, TKey = IndexableType> {
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    with: (spec: Object) => Promise<T[]>;
  }
}

'use client';

import {
  type NewDashboardStore,
  createNewDashboardStore,
} from '@/stores/new-dashboard-store';
import { type ReactNode, createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

export type NewDashboardApi = ReturnType<typeof createNewDashboardStore>;

export const NewDashboardStoreContext = createContext<NewDashboardApi | null>(
  null,
);

export type NewDashboardProviderProps = {
  children: ReactNode;
};

export function NewDashbaordProvider({ children }: NewDashboardProviderProps) {
  const storeRef = useRef<NewDashboardApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createNewDashboardStore();
  }

  return (
    <NewDashboardStoreContext.Provider value={storeRef.current}>
      {children}
    </NewDashboardStoreContext.Provider>
  );
}

export const useNewDashboardStore = <T,>(
  selector: (store: NewDashboardStore) => T,
): T => {
  const newDashboardStoreContext = useContext(NewDashboardStoreContext);

  if (!newDashboardStoreContext) {
    throw new Error(
      'useNewDashboardStore must be used within a NewDashboardProvider',
    );
  }

  return useStore(newDashboardStoreContext, selector);
};

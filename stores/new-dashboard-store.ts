import type { BoardSchema, ProjectSchema } from '@/lib/dexie';
import { createStore } from 'zustand/vanilla';

export type NewDashboardState = {
  project: ProjectSchema | null;
  board: BoardSchema | null;
};

export type NewDashbaordActions = {
  addProject: (project: ProjectSchema) => void;
  addBoard: (board: BoardSchema) => void;
  clear: () => void;
};

export type NewDashboardStore = NewDashboardState & NewDashbaordActions;

export const defaultInitState: NewDashboardState = {
  project: null,
  board: null,
};

export function createNewDashboardStore(
  initState: NewDashboardState = defaultInitState,
) {
  return createStore<NewDashboardStore>(set => ({
    ...initState,
    addProject: project => set(state => ({ ...state, project })),
    addBoard: board => set(state => ({ ...state, board })),
    clear: () => set(defaultInitState),
  }));
}

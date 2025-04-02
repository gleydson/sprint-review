import Dexie, { type EntityTable } from 'dexie';
import relationships from 'dexie-relationships';

export type ProjectSchema = {
  id: string;
  name: string;
  key: string;
};

export type BoardSchema = {
  id: number;
  name: string;
  type: 'kanban' | 'scrum';
  projectId: string;
  location: {
    avatarURI: string;
    displayName: string;
    name: string;
    projectId: string;
    projectKey: string;
    projectName: string;
    projectTypeKey: string;
  };
};

export type SprintSchema = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  state: 'closed' | 'active' | 'future';
  goal: string;
  boardId: number;
  projectId: string;
};

type Database = Dexie & {
  projects: EntityTable<ProjectSchema, 'id'>;
  boards: EntityTable<BoardSchema, 'id'>;
  sprints: EntityTable<SprintSchema, 'id'>;
};

function getDb() {
  if (typeof window === 'undefined') {
    return null;
  }

  const db = new Dexie('SprintReviewDB', {
    addons: [relationships],
  }) as Database;

  db.version(1).stores({
    projects: 'id, name, key',
    boards: 'id, name, type, projectId -> projects.id',
    sprints:
      'id, name, startDate, endDate, status, goal, boardId -> boards.id, projectId -> projects.id',
  });

  return db;
}

export const db = getDb() as Database;

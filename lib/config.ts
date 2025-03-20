export const boardStatuses = [
  'backlog',
  'dev',
  'code review',
  'homolog',
  'cancelled',
  'deploy',
  'done',
] as const;

export type BoardStatus = (typeof boardStatuses)[number];

export const taskTypes = [
  'Story',
  'Bug',
  'Subtask',
  'Task',
  'Technical Debt',
  'Spike',
];

export const presetedTeams = ['web', 'backend', 'mobile'];

export const possibleMobileTeams = ['mobile', 'ios', 'android', 'stone', 'ton'];

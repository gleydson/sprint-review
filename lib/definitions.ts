export type PaginatedResponse<T, I extends boolean = false> = {
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
} & (I extends true ? { issues: T[] } : { values: T[] });

export type AvatarUrls = {
  '16x16': string;
  '24x24': string;
  '32x32': string;
  '48x48': string;
};

export type Insight = {
  lastIssueUpdateTime: string;
  totalIssueCount: number;
};

export type ProjectCategory = {
  description: string;
  id: string;
  name: string;
  self: string;
};

export type Project = {
  avatarUrls: AvatarUrls;
  id: string;
  insight: Insight;
  key: string;
  name: string;
  projectCategory: ProjectCategory;
  self: string;
  simplified: boolean;
  style: string;
};

export type Board = {
  id: number;
  name: string;
  type: 'kanban' | 'scrum';
  location: { projectId: number; projectKey: string };
};

export type Sprint = {
  id: number;
  name: string;
  state: 'closed' | 'active' | 'future';
  startDate: string;
  endDate: string;
  completeDate?: string;
  goal: string;
};

export type User = {
  accountId: string;
  accountType: string;
  active: boolean;
  avatarUrls: AvatarUrls;
  displayName: string;
  emailAddress: string;
  key: string;
  name: string;
  self: string;
  timeZone: string;
};

type Content = {
  type: string; // ex.: "paragraph", "text"
  text?: string; // Apenas para type: "text"
  content?: Content[]; // Recursivo para aninhamento
};

type Doc = {
  type: string; // ex.: "doc"
  version: number;
  content: Content[];
};

type Visibility = {
  identifier: string;
  type: string; // ex.: "role", "group"
  value: string; // ex.: "Administrators", "jira-developers"
};

type Comment = {
  author: User;
  body: Doc;
  created: string;
  id: string;
  self: string;
  updateAuthor: User;
  updated: string;
  visibility: Visibility;
};

type Epic = {
  id: number;
  self: string;
  name: string;
  summary: string;
  color: { key: string }; // ex.: "color_4"
  done: boolean;
};

type Worklog = {
  author: User;
  comment: Doc;
  id: string;
  issueId: string;
  self: string;
  started: string;
  timeSpent: string; // ex.: "3h 20m"
  timeSpentSeconds: number;
  updateAuthor: User;
  updated: string;
  visibility: Visibility;
};

type Timetracking = {
  originalEstimate: string; // ex.: "10m"
  originalEstimateSeconds: number;
  remainingEstimate: string; // ex.: "3m"
  remainingEstimateSeconds: number;
  timeSpent: string; // ex.: "6m"
  timeSpentSeconds: number;
};

type Fields = {
  summary: string;
  flagged: boolean;
  sprint: Sprint;
  closedSprints: Sprint[];
  description: string;
  project: Project;
  comment: Comment[];
  epic: Epic;
  worklog: Worklog[];
  updated: number;
  timetracking: Timetracking;
  status: {
    name: string;
  };
  issuetype: {
    name: string;
  };
  created: string;
  resolutiondate: string | null;
};

export type Issue = {
  expand: string;
  fields: Fields;
  id: string;
  key: string;
  self: string;
};

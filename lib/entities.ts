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

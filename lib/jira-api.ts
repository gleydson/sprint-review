import type { AvatarUrls, Project } from './entities';
import { jiraHttpClient } from './jira-http-client';

type PaginatedResponse<T> = {
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: T[];
};

interface User {
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
}

export async function getMyself() {
  const data = await jiraHttpClient<User>('/rest/api/3/myself');
  return data;
}

export async function getIssueTypes() {
  const data = await jiraHttpClient('/rest/api/3/issuetype');
  return data;
}

type GetProjectsParams = {
  query?: string;
  startAt?: number;
  maxResults?: number;
  orderBy?: 'key' | 'name';
};

export async function getProjects({
  query = '',
  startAt = 0,
  maxResults = 10,
  orderBy,
}: GetProjectsParams = {}) {
  const data = await jiraHttpClient<PaginatedResponse<Project>>(
    '/rest/api/3/project/search',
    {
      params: {
        query,
        startAt,
        maxResults,
        orderBy,
      },
    },
  );
  return data;
}

interface Insight {
  lastIssueUpdateTime: string;
  totalIssueCount: number;
}

interface ProjectCategory {
  description: string;
  id: string;
  name: string;
  self: string;
}

interface Component {
  ari: string;
  assignee: User;
  assigneeType: string;
  description: string;
  id: string;
  isAssigneeTypeValid: boolean;
  lead: User;
  metadata: {
    icon: string;
  };
  name: string;
  project: string;
  projectId: number;
  realAssignee: User;
  realAssigneeType: string;
  self: string;
}

interface Scope {
  project: {
    id: string;
  };
  type: string;
}

interface IssueType {
  avatarId: number;
  description: string;
  hierarchyLevel: number;
  iconUrl: string;
  id: string;
  name: string;
  self: string;
  subtask: boolean;
  entityId?: string;
  scope?: Scope;
}

interface Properties {
  [key: string]: string;
}

interface Roles {
  [key: string]: string;
}

interface DetailedProject {
  assigneeType: string;
  avatarUrls: AvatarUrls;
  components: Component[];
  description: string;
  email: string;
  id: string;
  insight: Insight;
  issueTypes: IssueType[];
  key: string;
  lead: User;
  name: string;
  projectCategory: ProjectCategory;
  properties: Properties;
  roles: Roles;
  self: string;
  simplified: boolean;
  style: string;
  url: string;
}

export async function getProject(key: string) {
  const data = await jiraHttpClient<DetailedProject>(
    `/rest/api/3/project/${key}`,
  );
  return data;
}

interface Status {
  description: string;
  iconUrl: string;
  id: string;
  name: string;
  self: string;
}

interface Statuses {
  id: string;
  name: string;
  self: string;
  statuses: Status[];
  subtask: boolean;
}

export async function getStatusesForProject(projectKey: string) {
  const data = await jiraHttpClient<Statuses[]>(
    `/rest/api/3/project/${projectKey}/statuses`,
  );
  return data;
}

interface Sprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
}

export async function getSprintsForProject(projectKey: string) {
  const data = await jiraHttpClient<Sprint[]>('/search', {
    params: {
      maxResults: 100,
      fields: 'customfield_10010',
      jql: `project = ${projectKey}`,
    },
  });

  // // Extrair sprints únicas do campo customfield_10010
  // const sprintsSet = new Set<string>();
  // data.issues.forEach(issue => {
  //   const sprint = issue.fields.customfield_10010;
  //   if (sprint) {
  //     sprintsSet.add(JSON.stringify({
  //       id: sprint.id,
  //       name: sprint.name,
  //       state: sprint.state,
  //       startDate: sprint.startDate,
  //       endDate: sprint.endDate,
  //       completeDate: sprint.completeDate || undefined
  //     }));
  //   }
  // });

  return Array.from(data);
}

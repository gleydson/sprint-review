'use server';

import type { PaginatedResponse, Project } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';

type GetProjectsParams = {
  query?: string;
  startAt?: number;
  maxResults?: number;
  orderBy?: 'key' | 'name';
};

export async function fetchProjects({
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

export async function fetchStatusesForProject(projectKey: string) {
  const data = await jiraHttpClient<Statuses[]>(
    `/rest/api/3/project/${projectKey}/statuses`,
  );
  return data;
}

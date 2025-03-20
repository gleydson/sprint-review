'use server';

import type { PaginatedResponse, Sprint } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';

type GetSprintsParams = {
  boardId: string;
  query?: string;
  maxResults?: number;
};

export async function fetchSprints({
  boardId,
  query = '',
  maxResults = 100,
}: GetSprintsParams) {
  const data = await jiraHttpClient<PaginatedResponse<Sprint>>(
    `/rest/agile/1.0/board/${boardId}/sprint`,
    {
      params: {
        startAt: 0,
        maxResults: maxResults,
        state: ['active', 'closed'].join(','),
      },
    },
  );
  return data.values.filter(sprint =>
    query
      ? sprint.name.toLowerCase().includes(query.toLowerCase()) ||
        sprint.goal.toLocaleLowerCase().includes(query.toLowerCase())
      : true,
  );
}

export async function fetchSprint(sprintId: string) {
  const data = await jiraHttpClient<Sprint>(
    `/rest/agile/1.0/sprint/${sprintId}`,
  );
  return data;
}

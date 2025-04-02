'use server';

import type { PaginatedResponse, Sprint } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';

type GetSprintsParams = {
  boardId: string;
  maxResults?: number;
  startAt?: number;
};

export async function fetchSprints({
  boardId,
  maxResults = 100,
  startAt = 0,
}: GetSprintsParams) {
  const data = await jiraHttpClient<PaginatedResponse<Sprint>>(
    `/rest/agile/1.0/board/${boardId}/sprint`,
    {
      params: {
        startAt,
        maxResults,
        state: ['active', 'closed'].join(','),
      },
    },
  );

  return data;
}

export async function fetchSprint(sprintId: string) {
  const data = await jiraHttpClient<Sprint>(
    `/rest/agile/1.0/sprint/${sprintId}`,
  );
  return data;
}

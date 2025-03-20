'use server';

import type { Board, PaginatedResponse } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';

export async function fetchBoardForProject(projectKey: string, query = '') {
  const data = await jiraHttpClient<PaginatedResponse<Board>>(
    `/rest/agile/1.0/board?projectKeyOrId=${projectKey}`,
    {
      params: {
        name: query,
      },
    },
  );
  return data;
}

export async function fetchBoard(boardId: string) {
  const data = await jiraHttpClient<Board>(`/rest/agile/1.0/board/${boardId}`);
  return data;
}

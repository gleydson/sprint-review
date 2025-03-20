'use server';

import type { Issue, PaginatedResponse } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';

export async function getIssueTypes() {
  const data = await jiraHttpClient('/rest/api/3/issuetype');
  return data;
}

type GetIssuesForSprintParams = {
  sprintId: string;
  startAt?: number;
  maxResults?: number;
};

export async function getIssuesForSprint({
  sprintId,
  startAt = 0,
  maxResults = 100,
}: GetIssuesForSprintParams) {
  const data = await jiraHttpClient<PaginatedResponse<Issue, true>>(
    `/rest/agile/1.0/sprint/${sprintId}/issue`,
    {
      params: {
        startAt,
        maxResults,
      },
    },
  );
  return data;
}

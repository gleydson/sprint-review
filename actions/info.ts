'use server';

import type { ServerInfo } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';

export async function fetchServerInfo() {
  const data = await jiraHttpClient<ServerInfo>('/rest/api/3/serverInfo');
  return data;
}

'use server';

import type { User } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';

export async function fetchUser() {
  const data = await jiraHttpClient<User>('/rest/api/3/myself');
  return data;
}

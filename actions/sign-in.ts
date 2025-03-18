'use server';

import { jiraHttpClient } from '@/lib/jira-http-client';
import { cookies } from 'next/headers';

export async function signInAction(formData: FormData) {
  const cookieStore = await cookies();

  try {
    const email = formData.get('email') as string | null;
    const token = formData.get('token') as string | null;
    const credentials = `${email}:${token}`;

    const authToken = Buffer.from(credentials).toString('base64');

    await jiraHttpClient('/board', {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    });

    cookieStore.set('auth-token', authToken, {
      secure: true,
      sameSite: 'strict',
    });
  } catch (error) {
    console.error('Error fetching user info', error);
  }
}

'use server';

import type { User } from '@/lib/definitions';
import { JiraHttpClientError, jiraHttpClient } from '@/lib/jira-http-client';
import { strToBase64 } from '@/lib/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const SignInFormSchema = z.object({
  domain: z.string().url(),
  email: z.string().email(),
  token: z.string().min(1),
});

type FormState = {
  message?: string;
} | null;

export async function signIn(_: FormState, formData: FormData) {
  const cookieStore = await cookies();

  try {
    const { domain, email, token } = SignInFormSchema.parse({
      domain: formData.get('domain'),
      email: formData.get('email'),
      token: formData.get('token'),
    });

    const credentials = `${email}:${token}`;
    const authToken = strToBase64(credentials);

    const url = `${domain}/rest/api/3/myself`.replace(/([^:])\/\/+/g, '$1/');
    await jiraHttpClient<User>(url, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    });

    cookieStore.set('jira-domain', domain, {
      httpOnly: false,
      sameSite: 'strict',
    });
    cookieStore.set('jira-email', email, {
      httpOnly: false,
      sameSite: 'strict',
    });
    cookieStore.set('auth-token', authToken, {
      httpOnly: false,
      sameSite: 'strict',
    });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return {
        message: 'Invalid credentials. Please try again.',
      };
    }

    if (error instanceof JiraHttpClientError) {
      if (error.statusCode === 401) {
        return {
          message: 'Invalid credentials. Please try again.',
        };
      }

      return {
        message: 'An error occurred. Check your credentials and try again.',
      };
    }

    return {
      message: 'An error occurred. Check your credentials and try again.',
    };
  }

  redirect('/');
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('jira-domain');
  cookieStore.delete('jira-email');
  cookieStore.delete('auth-token');
  redirect('/sign-in');
}

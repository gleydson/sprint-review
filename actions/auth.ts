'use server';

import type { User } from '@/lib/definitions';
import { jiraHttpClient } from '@/lib/jira-http-client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const SignInFormSchema = z.object({
  email: z.string().email(),
  token: z.string(),
});

type FormState = {
  message?: string;
} | null;

export async function signIn(_: FormState, formData: FormData) {
  const cookieStore = await cookies();

  try {
    const { email, token } = SignInFormSchema.parse({
      email: formData.get('email'),
      token: formData.get('token'),
    });

    const credentials = `${email}:${token}`;

    const authToken = Buffer.from(credentials).toString('base64');

    await jiraHttpClient<User>('/rest/api/3/myself', {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    });

    cookieStore.set('auth-token', authToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return {
        message: 'Invalid credentials. Please try again.',
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message ?? 'An error occurred. Please try again.',
      };
    }

    return {
      message: 'An error occurred. Please try again.',
    };
  }

  redirect('/');
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  redirect('/sign-in');
}

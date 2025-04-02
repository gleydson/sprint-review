'use server';

import type { User } from '@/lib/definitions';
import { JiraHttpClientError, jiraHttpClient } from '@/lib/jira-http-client';
import { strToBase64 } from '@/lib/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const SignInFormSchema = z.object({
  domain: z.string().url('Invalid domain URL').min(1, 'Domain is required'),
  email: z.string().email('Invalid email address'),
  token: z.string().min(1, 'Token is required'),
});

type SignInFormInputs = z.infer<typeof SignInFormSchema>;

type SignInFormState = {
  success: boolean;
  message?: string;
  errors?: z.inferFlattenedErrors<typeof SignInFormSchema>['fieldErrors'];
  inputs?: SignInFormInputs;
};

export async function signIn(
  _: SignInFormState | null,
  formData: FormData,
): Promise<SignInFormState> {
  const cookieStore = await cookies();

  const rawData: SignInFormInputs = {
    domain: formData.get('domain') as string,
    email: formData.get('email') as string,
    token: formData.get('token') as string,
  };

  try {
    const validatedData = SignInFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Invalid credentials. Fix the errors and try again.',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const { domain, email, token } = validatedData.data;

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

    if (error instanceof JiraHttpClientError) {
      if (error.statusCode === 401) {
        return {
          success: false,
          message:
            'Authentication failed. Check your credentials and try again.',
          inputs: rawData,
        };
      }

      return {
        success: false,
        message: 'An error occurred. Check your credentials and try again.',
      };
    }

    return {
      success: false,
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

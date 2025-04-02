import { cookies } from 'next/headers';

export class JiraHttpClientError extends Error {
  statusCode: number;

  constructor({
    message,
    statusCode,
  }: { message: string; statusCode: number }) {
    super(message);
    this.name = 'JiraHttpClientError';
    this.statusCode = statusCode;
  }
}

type HttpParams = Record<string, unknown>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type HttpBody = Record<string, unknown>;
type HttpHeaders = Record<string, string>;
type Options = Omit<RequestInit, 'body' | 'method' | 'headers'> & {
  body?: HttpBody;
  method?: HttpMethod;
  headers?: HttpHeaders;
  params?: HttpParams;
};

const TRAILING_SLASH_REGEX = /\/$/;

export async function jiraHttpClient<T>(url: string, options?: Options) {
  const {
    headers,
    params,
    body,
    method = 'GET',
    ...restOptions
  } = options ?? {};

  const resolvedUrl = await resolveUrl(url, params);
  const resolvedHeaders = await resolveHeaders(headers);
  const resolvedBody = resolveBody(body);
  const response = await fetch(resolvedUrl, {
    method,
    headers: resolvedHeaders,
    body: resolvedBody,
    ...restOptions,
  });

  if (!response.ok) {
    console.error({
      status: response.status,
      statusText: response.statusText,
      url: resolvedUrl,
    });
    throw new JiraHttpClientError({
      message: 'An error occurred while fetching data from Jira.',
      statusCode: response.status,
    });
  }

  const res = (await response.json()) as T;
  return res;
}

async function resolveUrl(path: string, params?: HttpParams) {
  const cookieStore = await cookies();
  const jiraDomain = cookieStore.get('jira-domain')?.value;

  if (!(jiraDomain || path.startsWith('https://'))) {
    throw new Error('Jira domain is missing.');
  }

  let baseUrl = '';

  if (path.startsWith('https://')) {
    baseUrl = '';
  } else if (jiraDomain) {
    baseUrl = jiraDomain;
  } else {
    throw new Error('Jira domain is missing.');
  }

  const fullUrl = `${baseUrl}${path}`
    .replace(/([^:]\/)\/+/g, '$1')
    .replace(TRAILING_SLASH_REGEX, '');

  const url = new URL(fullUrl);

  if (!params || Object.keys(params).length === 0) return url;

  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  }

  return url;
}

async function resolveHeaders(headers?: HttpHeaders) {
  const cookieStore = await cookies();
  const defaultHeaders = new Headers(headers);
  defaultHeaders.set('Accept', 'application/json');

  const authToken = cookieStore.get('auth-token')?.value;

  if (authToken) {
    defaultHeaders.set('Authorization', `Basic ${authToken}`);
  }

  const allHeaders = new Headers(defaultHeaders);

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      allHeaders.set(key, value);
    }
  }

  return allHeaders;
}

function resolveBody(body?: HttpBody) {
  return body ? JSON.stringify(body) : undefined;
}

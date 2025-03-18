import { cookies } from 'next/headers';

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

const BASE_URL = 'https://allstone.atlassian.net';
const TRAILING_SLASH_REGEX = /\/$/;

function resolveUrl(path: string, params?: HttpParams) {
  const fullUrl = `${BASE_URL}/${path}`
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
  const token = cookieStore.get('auth-token');

  const defaultHeaders = new Headers();
  defaultHeaders.set('Accept', 'application/json');
  if (token) {
    defaultHeaders.set('Authorization', `Basic ${token.value}`);
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

export async function jiraHttpClient<T>(url: string, options?: Options) {
  const {
    headers,
    params,
    body,
    method = 'GET',
    ...restOptions
  } = options ?? {};

  const resolvedUrl = resolveUrl(url, params);
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
    throw new Error('Failed to fetch data');
  }

  const res = (await response.json()) as T;
  return res;
}

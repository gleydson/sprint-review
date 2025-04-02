'use client';

import { signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { IconAlertHexagon, IconCarouselVertical } from '@tabler/icons-react';
import Link from 'next/link';
import { type ComponentPropsWithoutRef, useActionState } from 'react';
import { Alert, AlertDescription } from './ui/alert';

export function LoginForm({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <Link
            href="#"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-8 items-center justify-center rounded-md">
              <IconCarouselVertical className="size-6" />
            </div>
            <span className="sr-only">Sprint Review logo</span>
          </Link>
          <CardTitle className="text-xl">Sprint Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="domain">Jira domain</Label>
                <Input
                  id="domain"
                  name="domain"
                  list="domain"
                  type="url"
                  required
                  placeholder="https://company.atlassian.net"
                  defaultValue={state?.inputs?.domain}
                  aria-describedby={
                    state?.errors?.domain ? 'domain-error' : 'domain-info'
                  }
                  aria-invalid={!!state?.errors?.domain}
                />

                <datalist id="domain">
                  <option value="https://allstone.atlassian.net/" />
                </datalist>

                {state?.errors?.domain ? (
                  <p
                    id="domain-error"
                    className="text-xs text-destructive text-pretty"
                    aria-live="polite"
                  >
                    {state.errors.domain[0]}
                  </p>
                ) : (
                  <p
                    id="domain-info"
                    className="text-xs text-muted-foreground text-pretty"
                  >
                    Your Atlassian domain, typically in the format
                    https://company.atlassian.net
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="your.email@company.com"
                  defaultValue={state?.inputs?.email}
                  aria-describedby={
                    state?.errors?.email ? 'email-error' : 'email-info'
                  }
                  aria-invalid={!!state?.errors?.email}
                />
                {state?.errors?.email ? (
                  <p
                    id="email-error"
                    className="text-xs text-destructive text-pretty"
                    aria-live="polite"
                  >
                    {state.errors.email[0]}
                  </p>
                ) : (
                  <p
                    id="email-info"
                    className="text-xs text-muted-foreground text-pretty"
                  >
                    The email address associated with your Atlassian account
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  name="token"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••••••••••••••••••••••"
                  defaultValue={state?.inputs?.token}
                  aria-describedby={
                    state?.errors?.token ? 'token-error' : 'token-info'
                  }
                  aria-invalid={!!state?.errors?.token}
                />
                {state?.errors?.token ? (
                  <p
                    id="token-error"
                    className="text-xs text-destructive text-pretty"
                    aria-live="polite"
                  >
                    {state.errors.token[0]}
                  </p>
                ) : (
                  <p
                    id="token-info"
                    className="text-xs text-muted-foreground text-pretty"
                  >
                    Your Atlassian API token. You can create one in your{' '}
                    <a
                      href="https://id.atlassian.com/manage-profile/security/api-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      Atlassian account settings
                    </a>
                  </p>
                )}
              </div>

              {state?.message && (
                <Alert variant="destructive">
                  <IconAlertHexagon className="size-4" />
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <Button
                aria-disabled={pending}
                type={pending ? 'button' : 'submit'}
                className="w-full"
              >
                {pending ? 'Login in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

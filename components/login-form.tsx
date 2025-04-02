'use client';

import { signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { IconAlertCircle, IconCarouselVertical } from '@tabler/icons-react';
import Link from 'next/link';
import { type ComponentPropsWithoutRef, useActionState } from 'react';

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
                />
                <datalist id="domain">
                  <option value="https://allstone.atlassian.net/" />
                </datalist>
                <p className="text-xs text-muted-foreground text-pretty">
                  Your Atlassian domain, typically in the format
                  https://company.atlassian.net
                </p>
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
                />
                <p className="text-xs text-muted-foreground">
                  The email address associated with your Atlassian account
                </p>
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
                />
                <p className="text-xs text-muted-foreground">
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
              </div>

              {state?.message ? (
                <output
                  aria-live="polite"
                  className="flex gap-2 items-center text-destructive text-pretty"
                >
                  <IconAlertCircle className="size-4" />
                  <p>{state.message}</p>
                </output>
              ) : null}

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

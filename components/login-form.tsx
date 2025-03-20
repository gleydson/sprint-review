'use client';

import { signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GalleryVerticalEndIcon } from 'lucide-react';
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
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEndIcon className="size-6" />
            </div>
            <span className="sr-only">Sprint Review logo</span>
          </Link>
          <CardTitle className="text-xl">Sprint Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="johndoe@stone.com.br"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="token">Token</Label>
                    <a
                      href="https://id.atlassian.com/manage-profile/security/api-tokens"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Get your token here
                    </a>
                  </div>
                  <Input
                    id="token"
                    name="token"
                    type="password"
                    autoComplete="current-password"
                    placeholder="ATATT3xFfGF0px3I00MLX_0c..."
                    required
                  />
                </div>

                {state?.message ? (
                  <p aria-live="polite" className="text-destructive">
                    {state.message}
                  </p>
                ) : null}

                <Button
                  aria-disabled={pending}
                  type={pending ? 'button' : 'submit'}
                  className="w-full"
                >
                  {pending ? 'Login in...' : 'Login'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

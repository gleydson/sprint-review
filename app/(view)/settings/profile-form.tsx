'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProfileForm() {
  return (
    <form className="space-y-8">
      <div>
        <Label>Username</Label>
        <Input placeholder="shadcn" />
        <p>
          This is your public display name. It can be your real name or a
          pseudonym. You can only change this once every 30 days.
        </p>
      </div>
      <div>
        <Label>Email</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
        <p>
          You can manage verified email addresses in your{' '}
          <Link href="/examples/forms">email settings</Link>.
        </p>
      </div>
      <div>
        <Label>Bio</Label>
        <p>
          You can <span>@mention</span> other users and organizations to link to
          them.
        </p>
      </div>
      <div>
        <Button type="button" variant="outline" size="sm" className="mt-2">
          Add URL
        </Button>
      </div>
      <Button type="submit">Update profile</Button>
    </form>
  );
}

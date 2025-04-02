'use client';

import { Button } from '@/components/ui/button';
import {} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/dexie';
import { useNewDashboardStore } from '@/providers/new-dashboard-provider';
import { IconArrowRight } from '@tabler/icons-react';
import { Kanban, LineChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, type ReactNode, useState } from 'react';
import { BoardSelector } from './board-selector';
import { ProjectSelector } from './project-selector';

export function SprintDashboardDialog({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { project, board, clear } = useNewDashboardStore(state => state);

  const isCreationDisabled = !(project && board);

  async function handleStartMonitoring(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isCreationDisabled) {
      // TODO: show error message
      return;
    }

    await db.projects.put(project, project.id);
    await db.boards.put(board, board.id);
    clear();

    router.push(`/${board.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="size-5 text-primary" />
            <DialogTitle>Monitoring a new board</DialogTitle>
          </div>
          <DialogDescription>
            Find out how your team is performing in real time.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleStartMonitoring}
          id="sprint-dashboard-form"
          className="space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LineChart className="size-4 text-muted-foreground" />
              <Label htmlFor="project" className="font-medium">
                Project
              </Label>
            </div>
            <ProjectSelector />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Kanban className="size-4 text-muted-foreground" />
              <Label htmlFor="board" className="font-medium">
                Board
              </Label>
            </div>
            <BoardSelector />
          </div>
        </form>

        <DialogFooter>
          <Button
            form="sprint-dashboard-form"
            type="submit"
            disabled={isCreationDisabled}
            className="gap-2"
          >
            Start monitoring
            <IconArrowRight className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

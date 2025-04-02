'use client';

import { db } from '@/lib/dexie';
import { NewDashbaordProvider } from '@/providers/new-dashboard-provider';
import { IconCirclePlus } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { type CSSProperties, Fragment } from 'react';
import { SprintDashboardDialog } from './sprint-dashboard-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

type BreadcrumbItemType = {
  label: string;
  path: string;
  isCurrentPage?: boolean;
};

const presetedPaths: Record<string, BreadcrumbItemType[]> = {
  '/': [
    {
      label: 'Boards',
      path: '/',
      isCurrentPage: true,
    },
  ],
  '/settings': [
    {
      label: 'Settings',
      path: '/settings',
    },
    {
      label: 'Profile',
      path: '/settings',
      isCurrentPage: true,
    },
  ],
  '/settings/appearance': [
    {
      label: 'Settings',
      path: '/settings',
    },
    {
      label: 'Appearance',
      path: '/settings/appearance',
      isCurrentPage: true,
    },
  ],
};

function useGetBreadcrumb(): BreadcrumbItemType[] {
  const params = useParams<{ sprintId?: string; boardId?: string }>();
  const pathname = usePathname();
  const parsedBoardId = params.boardId ? Number(params.boardId) : null;
  const parsedSprintId = params.sprintId ? Number(params.sprintId) : null;

  const currentBoard = useLiveQuery(
    () =>
      parsedBoardId
        ? db.boards.where('id').equals(parsedBoardId).toArray()
        : [],
    [parsedBoardId],
  )?.[0];

  const sprint = useLiveQuery(
    () =>
      parsedSprintId
        ? db.sprints.where('id').equals(parsedSprintId).toArray()
        : [],
    [parsedSprintId],
  )?.[0];

  const board = useLiveQuery(
    () =>
      db.boards
        .where('id')
        .equals(sprint?.boardId ?? '')
        .toArray(),
    [sprint],
  )?.[0];

  if (sprint) {
    return [
      {
        label: board?.name ?? '',
        path: `/${board?.id}`,
      },
      {
        label: sprint.name,
        path: `/${board?.id}/sprints/${sprint.id}`,
        isCurrentPage: true,
      },
    ];
  }

  if (currentBoard) {
    return [
      {
        label: 'Boards',
        path: '/',
      },
      {
        label: currentBoard.name,
        path: `/${currentBoard.id}`,
        isCurrentPage: true,
      },
    ];
  }

  if (presetedPaths[pathname]) {
    return presetedPaths[pathname];
  }

  return [];
}

export function SiteHeader() {
  const params = useParams<{ sprintId?: string }>();
  const breadcrumbs = useGetBreadcrumb();

  return (
    <header
      style={
        {
          '--header-height': 'calc(var(--spacing) * 12 + 1px)',
        } as CSSProperties
      }
      className="flex w-full h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div className="flex w-full items-center gap-1lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 !h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map(({ label, path, isCurrentPage }, index) => {
                if (isCurrentPage) {
                  return (
                    <BreadcrumbItem
                      key={index.toString()}
                      className="hidden md:block max-w-32 truncate"
                    >
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  );
                }

                return (
                  <Fragment key={index.toString()}>
                    <BreadcrumbItem className="hidden md:block max-w-32 truncate">
                      <BreadcrumbLink asChild>
                        <Link href={path}>{label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/gleydson/sprint-review"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>

          <NewDashbaordProvider>
            <SprintDashboardDialog>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
                <IconCirclePlus />
                <span>Add new board</span>
              </Button>
            </SprintDashboardDialog>
          </NewDashbaordProvider>
        </div>
      </div>
    </header>
  );
}

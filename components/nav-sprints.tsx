'use client';

import { db } from '@/lib/dexie';
import {
  IconChevronRight,
  IconDashboard,
  IconLayoutKanban,
} from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from './ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from './ui/sidebar';

type TreeItem =
  | {
      name: string;
      type: 'board';
      items?: TreeItem[];
    }
  | {
      id: number;
      name: string;
      type: 'sprint';
      state: 'active' | 'closed' | 'future';
      boardId: number;
    };

type NavSprints = {
  items: TreeItem[];
};

export function NavSprints() {
  const projects = useLiveQuery(() => db.projects.toArray()) ?? [];
  const boards = useLiveQuery(() => db.boards.toArray()) ?? [];
  const sprints = useLiveQuery(() => db.sprints.toArray()) ?? [];

  const items: TreeItem[] = [];

  for (const project of projects) {
    for (const board of boards) {
      if (board.projectId === project.id) {
        items.push({
          name: board.name,
          type: 'board',
          items: sprints
            .filter(sprint => sprint.boardId === board.id)
            .map(sprint => ({
              id: sprint.id,
              name: sprint.name,
              type: 'sprint',
              state: sprint.state,
              boardId: sprint.boardId,
            })),
        });
      }
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => (
            <Tree key={index.toString()} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const iconVariants = {
  board: IconLayoutKanban,
  sprint: IconDashboard,
};

type TreeProps = {
  item: TreeItem;
};

function Tree({ item }: TreeProps) {
  const params = useParams<{ sprintId: string }>();
  const Icon = iconVariants[item.type];

  if (item.type === 'sprint') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={params.sprintId === item.id.toString()}
          className="data-[active=true]:bg-primary/30 w-full min-w-[calc(var(--sidebar-width)*0.7)] pr-1"
          asChild
        >
          <Link href={`/${item.boardId}/sprints/${item.id}`}>
            <Icon />
            <p className="truncate">{item.name}</p>
            <Badge className="ml-auto px-1 py-0.5">{item.state}</Badge>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <IconChevronRight className="transition-transform" />
            <Icon />
            <p className="truncate">{item.name}</p>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem, index) => (
              <Tree key={index.toString()} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

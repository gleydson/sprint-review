import { fetchServerInfo } from '@/actions/info';
import { fetchUser } from '@/actions/user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  IconDashboard,
  IconPalette,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { Command } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { NavMain, type NavMainItem } from './nav-main';
import { NavSprints } from './nav-sprints';
import { NavUser } from './nav-user';

const navMain: NavMainItem[] = [
  {
    title: 'Boards',
    url: '/',
    icon: <IconDashboard />,
  },
  {
    title: 'Settings',
    icon: <IconSettings />,
    subItems: [
      {
        title: 'Profile',
        url: '/settings',
        icon: <IconUser />,
      },
      {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: <IconPalette />,
      },
    ],
  },
];

export async function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const user = await fetchUser();
  const serverInfo = await fetchServerInfo();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {serverInfo.serverTitle}
                  </span>
                  <span className="truncate text-xs">{serverInfo.baseUrl}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSprints />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.displayName,
            email: user.emailAddress,
            avatar: user.avatarUrls['48x48'],
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

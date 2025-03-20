'use client';
import { fetchProjects } from '@/actions/projects';
import type { Project } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function ProjectSelector() {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function getProjects(key: string) {
      try {
        const data = await fetchProjects({
          query: key,
        });
        setSelectedProject(data.values[0]);
      } catch (error) {
        console.error(error);
      }
    }

    const pKey = searchParams.get('projectKey');

    if (pKey) {
      getProjects(pKey);
    } else {
      setSelectedProject(null);
      setProjects([]);
    }
  }, [searchParams]);

  async function handleSearchProject(value: string) {
    try {
      const data = await fetchProjects({
        query: value,
      });
      setProjects(data.values);
    } catch (error) {
      console.error(error);
    }
  }

  const popoverContentWidth = useMemo(() => {
    // Calculate the minimum width needed for the dropdown content
    const minWidth = 180;
    const selectedWidth = selectedProject
      ? selectedProject.name.length * 8 + 40
      : 0;
    const maxProjectWidth = Math.max(
      ...projects.map(p => p.name.length * 8 + 40),
    );
    return Math.max(minWidth, selectedWidth, maxProjectWidth);
  }, [projects, selectedProject]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={open ? 'outline' : 'ghost'}
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className={cn('min-w-[120px] justify-between px-3')}
        >
          <span className="truncate">
            {selectedProject ? selectedProject.name : 'Select project...'}
          </span>
          {open && (
            <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50 flex-none" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: `${popoverContentWidth}px` }}
      >
        <Command>
          <CommandInput
            placeholder="Search projects..."
            className="h-9"
            onValueChange={handleSearchProject}
          />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {projects.map(project => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    setSelectedProject(project);

                    const params = new URLSearchParams(searchParams);
                    params.set('projectKey', project.key);
                    params.delete('boardId');
                    params.delete('sprintId');
                    router.replace(`${pathname}?${params.toString()}`);

                    setOpen(false);
                  }}
                >
                  {project.name}
                  <IconCheck
                    className={cn(
                      'ml-auto size-4',
                      selectedProject?.id === project.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

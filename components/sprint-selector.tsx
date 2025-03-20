'use client';

import { fetchSprint, fetchSprints } from '@/actions/sprints';
import type { Sprint } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from './ui/badge';
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

export function SprintSelector() {
  const [open, setOpen] = useState(false);

  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const boardId = searchParams.get('boardId');

  // useEffect(() => {
  //   async function fetchSprints(id: string) {
  //     try {
  //       const data = await searchSprints({
  //         boardId: id,
  //         maxResults: 10,
  //       });
  //       setSprints(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   if (boardId) {
  //     fetchSprints(boardId);
  //   }
  // }, [boardId]);

  useEffect(() => {
    async function fetchSelectedSprint(id: string) {
      try {
        const data = await fetchSprint(id);
        setSelectedSprint(data);
      } catch (error) {
        console.error(error);
      }
    }

    const sprintId = searchParams.get('sprintId');

    if (sprintId) {
      fetchSelectedSprint(sprintId);
    } else {
      setSelectedSprint(null);
      setSprints([]);
    }
  }, [searchParams]);

  async function handleSearchSprint(value: string) {
    try {
      const data = await fetchSprints({
        boardId: boardId ?? '',
        query: value,
      });
      setSprints(data);
    } catch (error) {
      console.error(error);
    }
  }

  const popoverContentWidth = useMemo(() => {
    // Calculate the minimum width needed for the dropdown content
    const minWidth = 180;
    const selectedWidth = selectedSprint
      ? selectedSprint.name.length * 8 + 40
      : 0;
    const maxSprintWidth = Math.max(
      ...sprints.map(s => s.name.length * 8 + 40),
    );
    return Math.max(minWidth, selectedWidth, maxSprintWidth);
  }, [selectedSprint, selectedSprint?.name, sprints]);

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
            {selectedSprint ? selectedSprint.name : 'Select sprint...'}
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
            placeholder="Search sprints..."
            className="h-9"
            onValueChange={handleSearchSprint}
          />
          <CommandList>
            <CommandEmpty>
              No sprints found. Select a project first.
            </CommandEmpty>
            <CommandGroup>
              {sprints.map(sprint => (
                <CommandItem
                  key={sprint.id}
                  value={sprint.name}
                  onSelect={() => {
                    setSelectedSprint(sprint);

                    const params = new URLSearchParams(searchParams);
                    params.set('sprintId', sprint.id.toString());
                    router.replace(`${pathname}?${params.toString()}`);

                    setOpen(false);
                  }}
                >
                  {sprint.name} <Badge>{sprint.state}</Badge>
                  <IconCheck
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedSprint?.id === sprint.id
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

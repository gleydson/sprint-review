'use client';

import { fetchBoard, fetchBoardForProject } from '@/actions/boards';
import type { Board } from '@/lib/definitions';
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

export function BoardSelector() {
  const [open, setOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const projectKey = searchParams.get('projectKey');
  const boardId = searchParams.get('boardId');

  useEffect(() => {
    async function getBoard(boardId: string) {
      try {
        const data = await fetchBoard(boardId);
        setSelectedBoard(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (boardId) {
      getBoard(boardId);
    } else {
      setSelectedBoard(null);
      setBoards([]);
    }
  }, [boardId]);

  async function handleSearchBoard(value: string) {
    try {
      const data = await fetchBoardForProject(projectKey ?? '', value);
      setBoards(data.values);
    } catch (error) {
      console.error(error);
    }
  }

  const popoverContentWidth = useMemo(() => {
    // Calculate the minimum width needed for the dropdown content
    const minWidth = 180;
    const selectedWidth = selectedBoard
      ? selectedBoard.name.length * 8 + 40
      : 0;
    const maxBoardWidth = Math.max(...boards.map(p => p.name.length * 8 + 40));
    return Math.max(minWidth, selectedWidth, maxBoardWidth);
  }, [boards, selectedBoard]);

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
            {selectedBoard ? selectedBoard.name : 'Select board...'}
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
            placeholder="Search boards..."
            className="h-9"
            onValueChange={handleSearchBoard}
          />
          <CommandList>
            <CommandEmpty>No boards found.</CommandEmpty>
            <CommandGroup>
              {boards.map(board => (
                <CommandItem
                  key={board.id}
                  value={board.name}
                  onSelect={() => {
                    setSelectedBoard(board);

                    const params = new URLSearchParams(searchParams);
                    params.set('boardId', board.id.toString());
                    params.delete('sprintId');
                    router.replace(`${pathname}?${params.toString()}`);

                    setOpen(false);
                  }}
                >
                  {board.name}
                  <IconCheck
                    className={cn(
                      'ml-auto size-4',
                      selectedBoard?.id === board.id
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

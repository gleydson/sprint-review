'use client';

import { fetchBoardForProject } from '@/actions/boards';
import { useDebounceAction } from '@/hooks/use-debounce-action';
import type { Board } from '@/lib/definitions';
import { useNewDashboardStore } from '@/providers/new-dashboard-provider';
import { useEffect, useState } from 'react';
import { SearchSelector } from './search-selector';

export function BoardSelector() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { project, board, addBoard, clear } = useNewDashboardStore(
    state => state,
  );

  const projectKey = project?.key;

  const action = useDebounceAction(handleSearchBoard, {
    delay: 300,
  });

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  function handleChangeQuery(value: string) {
    setIsSearching(true);
    setSearchQuery(value);
    action(value);
  }

  async function handleSearchBoard(value: string) {
    try {
      if (projectKey) {
        const data = await fetchBoardForProject(projectKey, value);
        setBoards(data.values);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectBoard(value: string) {
    const b = boards.find(b => b.id.toString() === value);
    if (b && projectKey) {
      addBoard({ ...b, projectId: projectKey });
    }
  }

  const items = boards.map(board => ({
    label: board.name,
    value: board.id.toString(),
  }));

  return (
    <SearchSelector
      items={items}
      query={searchQuery}
      onChangeQuery={handleChangeQuery}
      onSelect={handleSelectBoard}
      value={board?.id.toString()}
      isSearching={isSearching}
      placeholder="Search for a board"
      inputPlaceholder="Search for a board by name"
      notFoundMessage="No boards found."
      searchMessage="Type to search for boards"
    />
  );
}

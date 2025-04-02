'use client';

import { fetchProjects } from '@/actions/projects';
import { useDebounceAction } from '@/hooks/use-debounce-action';
import type { Project } from '@/lib/definitions';
import { useNewDashboardStore } from '@/providers/new-dashboard-provider';
import { useEffect, useState } from 'react';
import { SearchSelector } from './search-selector';

export function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { project, addProject, clear } = useNewDashboardStore(state => state);

  const action = useDebounceAction(handleSearchProject, {
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

  async function handleSearchProject(value: string) {
    try {
      const data = await fetchProjects({
        query: value,
      });
      setProjects(data.values);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectProject(value: string) {
    const p = projects.find(p => p.key === value);
    if (p) {
      addProject(p);
    }
  }

  const items = projects.map(p => ({
    label: p.name,
    value: p.key,
  }));

  return (
    <SearchSelector
      items={items}
      query={searchQuery}
      onChangeQuery={handleChangeQuery}
      onSelect={handleSelectProject}
      value={project?.key}
      isSearching={isSearching}
      placeholder="Search for a project"
      inputPlaceholder="Search for a project by name or key"
      notFoundMessage="No projects found."
      searchMessage="Type to search for projects"
    />
  );
}

'use client';

import { cn, normalizeText } from '@/lib/utils';
import {
  IconCheck,
  IconLoader,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import { useState } from 'react';
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

type SearchSelectorItem = {
  label: string;
  value: string;
};

type SearchSelectorProps = {
  items: SearchSelectorItem[];
  placeholder?: string;
  value?: string;
  isSearching?: boolean;
  onSelect?: (value: string) => void;
  notFoundMessage?: string;
  inputPlaceholder?: string;
  searchMessage?: string;
  query?: string;
  onChangeQuery?: (value: string) => void;
  filterFn?: (item: SearchSelectorItem, query: string) => boolean;
};

export function SearchSelector({
  items,
  value,
  query,
  onChangeQuery,
  onSelect,
  isSearching = false,
  notFoundMessage = 'No items found.',
  placeholder = 'Select an item',
  inputPlaceholder = 'Search for an item',
  searchMessage = 'Type to search for items',
}: SearchSelectorProps) {
  const [open, setOpen] = useState(false);

  const filteredItems = query
    ? items.filter(item =>
        normalizeText(item.label).includes(normalizeText(query)),
      )
    : items;

  console.log({
    value,
    v: items.find(item => item.value === value),
    items,
    query,
    filteredItems,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: This is a button
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          className="w-full justify-between"
        >
          {value
            ? items.find(item => item.value === value)?.label
            : placeholder}
          <IconSelector className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={inputPlaceholder}
            value={query}
            onValueChange={onChangeQuery}
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <IconLoader className="size-5 text-muted-foreground/50 mb-2 animate-spin" />
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : query === '' && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <IconSearch className="size-10 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">{searchMessage}</p>
                </div>
              ) : (
                notFoundMessage
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredItems.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={currentValue => {
                    onSelect?.(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <IconCheck
                    className={cn(
                      'mr-2 size-4',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

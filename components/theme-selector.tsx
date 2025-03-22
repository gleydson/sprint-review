'use client';

import { useThemeConfig } from './active-theme';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const DEFAULT_THEMES = [
  {
    name: 'Default',
    value: 'default',
  },
  {
    name: 'Neo brutalism',
    value: 'neo-brutalistm',
  },
  {
    name: 'Candyland',
    value: 'candyland',
  },
  {
    name: 'Claymorphism',
    value: 'claymorphism',
  },
  {
    name: 'Cyberpunk',
    value: 'cyberpunk',
  },
  {
    name: 'Elegant luxury',
    value: 'elegant-luxury',
  },
  {
    name: 'Midnight bloom',
    value: 'midnight-bloom',
  },
  {
    name: 'Modern minimal',
    value: 'modern-minimal',
  },
  {
    name: 'Nature',
    value: 'nature',
  },
  {
    name: 'Northern lights',
    value: 'northern-lights',
  },
  {
    name: 'Ocean breeze',
    value: 'ocean-breeze',
  },
  {
    name: 'Pastel dreams',
    value: 'pastel-dreams',
  },
  {
    name: 'Retro arcade',
    value: 'retro-arcade',
  },
];

const SCALED_THEMES = [
  {
    name: 'Default',
    value: 'default-scaled',
  },
];

const MONO_THEMES = [
  {
    name: 'Mono',
    value: 'mono-scaled',
  },
];

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <div className="flex items-center gap-2">
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          size="sm"
          className="justify-start *:data-[slot=select-value]:w-28"
        >
          <span className="text-muted-foreground hidden sm:block">
            Select a theme:
          </span>
          <span className="text-muted-foreground block sm:hidden">Theme</span>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Default</SelectLabel>
            {DEFAULT_THEMES.map(theme => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Scaled</SelectLabel>
            {SCALED_THEMES.map(theme => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Monospaced</SelectLabel>
            {MONO_THEMES.map(theme => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

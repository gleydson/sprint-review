import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function strToBase64(str: string) {
  return Buffer.from(str).toString('base64');
}

export function getInitials(name: string) {
  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.pop() ?? '';
  return `${firstName[0]}${lastName[0]}`;
}

export function normalizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  return (
    text
      .toLowerCase()
      .normalize('NFD')
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: This is intentional
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
  });
}

import { IconLoader } from '@tabler/icons-react';

// TODO: This is a placeholder component for loading states
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground w-full h-screen">
      <IconLoader className="size-5" />
      <h1>Loading</h1>
      <p>Something is cooking...</p>
    </div>
  );
}

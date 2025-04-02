'use client';

export default function BoardError() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground w-full h-screen">
      <h1>Something went wrong retrieving sprints</h1>
      <p>We are working on it...</p>
    </div>
  );
}

import { Suspense } from 'react';
import { BoardList } from './board-list';

export default function DashboardsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      }
    >
      <BoardList />
    </Suspense>
  );
}

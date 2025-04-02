import { fetchSprints } from '@/actions/sprints';
import { SprintTable } from '@/components/sprint-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';

type BoardPropsProps = {
  params: Promise<{ pid: string; boardId: string }>;
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>;
};

export default async function BoardProps({
  params,
  searchParams,
}: BoardPropsProps) {
  const { boardId } = await params;
  const { page, per_page: perPage } = await searchParams;

  const pageIndex = Number(page ?? 1);
  const pageSize = Number(perPage ?? 10);
  const maxResults = pageSize;
  const startAt = pageSize * (pageIndex - 1);

  const fetchSprintsPromise = fetchSprints({
    boardId,
    maxResults,
    startAt,
  });

  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Suspense fallback={<div>Carregando</div>}>
            <SprintTable fetchSprintsPromise={fetchSprintsPromise} />
          </Suspense>
        </TabsContent>
        <TabsContent value="favorites">Favorites</TabsContent>
      </Tabs>
    </div>
  );
}

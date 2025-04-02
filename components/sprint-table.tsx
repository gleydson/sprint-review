'use client';

import { usePaginationParams } from '@/hooks/use-pagination-params';
import type { PaginatedResponse, Sprint } from '@/lib/definitions';
import { formatDate } from '@/lib/utils';
import { IconPlayerPlay, IconStar, IconStarFilled } from '@tabler/icons-react';
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { use } from 'react';
import { DataTable } from './data-table';
import { DataTablePagination } from './data-table-pagination';
import { Badge } from './ui/badge';

export const getColumns: ({
  boardId,
}: { boardId: string }) => ColumnDef<Sprint>[] = ({ boardId }) => [
  {
    id: 'favorite',
    cell: ({ row }) => (
      <div className="flex items-center w-fit">
        {row.original.id ? (
          <IconStarFilled className="text-yellow-500 size-5" />
        ) : (
          <IconStar className="size-5" />
        )}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const sprint = row.original;
      return (
        <div className="flex items-center w-full flex-1">{sprint.name}</div>
      );
    },
  },
  {
    header: 'Period',
    cell: ({ row }) => {
      const sprint = row.original;
      return (
        <div className="flex items-center w-[200px]">
          {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
        </div>
      );
    },
  },
  {
    header: 'Status',
    cell: ({ row }) => {
      const sprint = row.original;
      return (
        <Badge
          shape="pill"
          variant={
            sprint.state === 'active'
              ? 'success'
              : sprint.state === 'future'
                ? 'secondary'
                : 'destructive'
          }
          className="w-fit capitalize"
        >
          {sprint.state}
        </Badge>
      );
    },
  },
  {
    header: 'View dashboard',
    cell: ({ row }) => {
      const sprint = row.original;
      return (
        <div className="flex items-center w-fit">
          <Link
            href={`/${boardId}/sprints/${sprint.id}`}
            className="text-primary underline underline-offset-2"
          >
            <IconPlayerPlay className="size-5" />
            <span className="sr-only">View dashboard</span>
          </Link>
        </div>
      );
    },
  },
];

type SprintTableProps = {
  fetchSprintsPromise: Promise<PaginatedResponse<Sprint>>;
};

export function SprintTable({ fetchSprintsPromise }: SprintTableProps) {
  const params = useParams<{ boardId: string }>();
  const response = use(fetchSprintsPromise);
  const data = response.values;
  const rowCount = response.total;
  const columns = getColumns({ boardId: params.boardId });

  const [pagination, setPagination] = usePaginationParams();

  const table = useReactTable({
    data,
    columns,
    getRowId: row => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(rowCount / pagination.pageSize),
    onPaginationChange: setPagination,
    manualPagination: true,
    manualFiltering: true,
    rowCount,
    state: {
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <DataTable columns={columns} table={table} />
      <DataTablePagination table={table} />
    </div>
  );
}

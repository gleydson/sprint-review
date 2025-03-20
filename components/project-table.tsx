'use client';

import type { Project } from '@/lib/definitions';
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTable } from './data-table';
import { Input } from './ui/input';

import { usePaginationParams } from '@/hooks/use-pagination-params';
import { useQueryState } from 'nuqs';
import { DataTablePagination } from './data-table-pagination';

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'key',
    header: 'Key',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

type ProjectTableProps = {
  data: Project[];
  rowCount: number;
};

export function ProjectTable({ data, rowCount }: ProjectTableProps) {
  const [q, setQ] = useQueryState('q', { defaultValue: '' });
  const [pagination, setPagination] = usePaginationParams();

  const table = useReactTable({
    data,
    columns,
    getRowId: row => row.id,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    manualFiltering: true,
    rowCount,
    state: {
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter projects..."
        value={q}
        onChange={event => {
          setQ(event.target.value);
        }}
        className="max-w-sm"
      />
      <DataTable columns={columns} table={table} />
      <DataTablePagination table={table} />
    </div>
  );
}

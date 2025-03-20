'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Issue, Sprint } from '@/lib/definitions';
import { getIssuesByCreationTime } from '@/lib/formatters';
import { Settings2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { ChartSettingsEditor } from './chart-settings-editor';
import { Button } from './ui/button';

const chartConfig: ChartConfig = {
  planejadas: {
    label: 'Planejadas',
    color: 'var(--chart-1)',
  },
  adicionadas: {
    label: 'Adicionadas durante a sprint',
    color: 'var(--chart-2)',
  },
};

type AddedVsPlannedProps = {
  issues: Issue[];
  sprint: Sprint;
};

export function AddedVsPlanned({ issues, sprint }: AddedVsPlannedProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const data = getIssuesByCreationTime(issues, sprint);

  const chartData = [
    {
      name: 'Added during sprint',
      value: data.createdAfterStart,
      fill: 'var(--chart-1)',
    },
    {
      name: 'Planned for sprint',
      value: data.openedWithSprint,
      fill: 'var(--chart-2)',
    },
  ];

  return (
    <>
      <Card ref={chartRef}>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Additions vs. planned work</CardTitle>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings2Icon className="size-4" />
            <span className="sr-only">Chart settings</span>
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto h-full">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index.toString()}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={value => `${value} issues`}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <ChartSettingsEditor
        chartRef={chartRef as React.RefObject<HTMLDivElement>}
        chartName="Additions vs. planned"
        chartType="pie"
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}

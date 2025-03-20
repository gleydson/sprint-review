'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import type { Issue, Sprint } from '@/lib/definitions';
import { prepareProgressData } from '@/lib/formatters';
import { Settings2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

type ResolvedIssuesProps = {
  issues: Issue[];
  sprint: Sprint;
};

export function ResolvedIssues({ issues, sprint }: ResolvedIssuesProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const progressData = prepareProgressData(issues, sprint);

  return (
    <>
      <Card ref={chartRef}>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Resolved tasks</CardTitle>

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
            <LineChart
              width={600}
              height={300}
              data={progressData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                label={{
                  value: 'Data',
                  position: 'insideBottomRight',
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: 'Resolved tasks',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="var(--chart-1)"
                name="Resolved tasks"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <ChartSettingsEditor
        chartRef={chartRef as React.RefObject<HTMLDivElement>}
        chartName="Resolved tasks"
        chartType="pie"
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}

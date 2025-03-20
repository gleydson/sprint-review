'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Issue, Sprint } from '@/lib/definitions';
import {
  calculateIssueTimesForSprint,
  prepareSimpleBarData,
} from '@/lib/formatters';
import { Settings2Icon } from 'lucide-react';
import { useRef, useState } from 'react';

import type { ChartConfig } from '@/components/ui/chart';
import { BarChart } from './bar-chart';
import { ChartSettingsEditor } from './chart-settings-editor';
import { Button } from './ui/button';

export type AverageOpenTimeData = {
  type: string;
  mean: number;
  stdDev: number;
};

type AverageOpenTimeProps = {
  issues: Issue[];
  sprint: Sprint;
};

export function AverageOpenTime({ issues, sprint }: AverageOpenTimeProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const data = calculateIssueTimesForSprint(issues, sprint);
  const chartData = prepareSimpleBarData(data);

  const config = chartData.reduce((acc, curr, idx) => {
    if (!(curr.type in acc)) {
      acc[curr.mean] = {
        label: curr.type,
        color: `var(--chart-${idx + 1})`,
      };
    }
    return acc;
  }, {} as ChartConfig);

  return (
    <>
      <Card ref={chartRef}>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Average open time</CardTitle>

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
          <BarChart
            data={chartData}
            config={config}
            xAxisKey="type"
            type="grouped"
            showLegend={false}
            showTooltip
          />
        </CardContent>
      </Card>
      <ChartSettingsEditor
        chartRef={chartRef as React.RefObject<HTMLDivElement>}
        chartName="Average open time"
        chartType="bar"
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}

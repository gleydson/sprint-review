'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BoardStatus } from '@/lib/config';
import type { Issue } from '@/lib/definitions';
import { issuesToBarChartData } from '@/lib/formatters';
import { Settings2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { BarChart } from './bar-chart';
import { ChartSettingsEditor } from './chart-settings-editor';
import { Button } from './ui/button';

export type TotalsByStatusData = {
  status: BoardStatus;
  'no team': number;
  mobile: number;
  web: number;
  backend: number;
};

type TotalsByStatusProps = {
  issues: Issue[];
};

export function TotalsByStatus({ issues }: TotalsByStatusProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data, config } = issuesToBarChartData(issues);

  return (
    <>
      <Card ref={chartRef}>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Totals by status</CardTitle>

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
            data={data}
            config={config}
            xAxisKey="status"
            type="stacked"
            showLegend
          />
        </CardContent>
      </Card>
      <ChartSettingsEditor
        chartRef={chartRef as React.RefObject<HTMLDivElement>}
        chartName="Totals by status"
        chartType="bar"
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}

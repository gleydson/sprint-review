'use client';

import {} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { Settings2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { BarChart, type BarChartData } from './bar-chart';
import { ChartSettingsEditor } from './chart-settings-editor';
import { Button } from './ui/button';

type TotalsByStatusProps = {
  data: BarChartData[];
  config: ChartConfig;
};

export function TotalsByStatus({ data, config }: TotalsByStatusProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
          <BarChart data={data} config={config} type="stacked" showLegend />
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

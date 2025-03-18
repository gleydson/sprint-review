import { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';

export type BarChartData = {
  [key: string]: number | string;
};

export type BarChartConfig = ChartConfig;

type BarChartProps = {
  data: BarChartData[];
  config?: BarChartConfig;
  type?: 'stacked' | 'grouped';
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
};

export function BarChart({
  data,
  config = {},
  type = 'grouped',
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
}: BarChartProps) {
  const xFields = useMemo(
    () =>
      data && data.length > 0
        ? Object.keys(data[0]).filter(key => typeof data[0][key] === 'number')
        : [],
    [data],
  );

  const maxTotal = useMemo(
    () =>
      type === 'stacked'
        ? Math.max(
            ...data.map(entry =>
              xFields.reduce((acc, key) => acc + (entry[key] as number), 0),
            ),
          )
        : Math.max(
            ...data.map(entry =>
              xFields.reduce(
                (acc, key) => Math.max(acc, entry[key] as number),
                0,
              ),
            ),
          ),
    [data, type, xFields],
  );

  const barKey = useMemo(
    () =>
      data && data.length > 0
        ? Object.keys(data[0]).find(key => typeof data[0][key] === 'string')
        : '',
    [data],
  );

  return (
    <ChartContainer config={config}>
      <RechartsBarChart accessibilityLayer data={data}>
        {showGrid ? <CartesianGrid vertical={false} /> : null}
        {showYAxis ? (
          <YAxis domain={[0, maxTotal + 3]} className="fill-muted-foreground" />
        ) : null}
        {showXAxis ? (
          <XAxis
            dataKey={barKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={value => value}
            className="capitalize"
          />
        ) : null}
        {showTooltip ? (
          <ChartTooltip
            content={<ChartTooltipContent hideLabel className="capitalize" />}
          />
        ) : null}
        {showLegend ? (
          <ChartLegend
            content={<ChartLegendContent className="capitalize" />}
          />
        ) : null}
        {xFields.map((field, idx) => (
          <Bar
            key={field}
            dataKey={field}
            stackId={type === 'stacked' ? 'a' : undefined}
            fill={config[field]?.color ?? `hsl(var(--chart-${idx + 1}))`}
          >
            {data.map((entry, index) => {
              const value = entry[field] as number;
              if (!value || value === 0) {
                return <Cell key={`cell-${index.toString()}`} radius={0} />;
              }

              if (type === 'grouped') {
                return <Cell key={`cell-${index.toString()}`} radius={4} />;
              }

              const valueKeys = Object.keys(entry).filter(key =>
                xFields.includes(key),
              );
              const firstValueIndex = valueKeys.findIndex(
                key => entry[key] !== 0,
              );
              const lastValueIndex = valueKeys.findLastIndex(
                key => entry[key] !== 0,
              );
              const currentIndex = valueKeys.findIndex(key => key === field);
              const isTop = currentIndex === lastValueIndex;
              const isBottom = currentIndex === firstValueIndex;

              const radius = 4;

              let r: number[] | number = [0, 0, 0, 0];

              if (isTop && isBottom) {
                r = radius;
              } else if (isTop) {
                r = [radius, radius, 0, 0];
              } else if (isBottom) {
                r = [0, 0, radius, radius];
              }

              return (
                <Cell
                  key={`cell-${index.toString()}`}
                  // @ts-expect-error
                  radius={r}
                />
              );
            })}
          </Bar>
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}

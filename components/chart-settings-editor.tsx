import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { boardStatuses, presetedTeams } from '@/lib/config';
import html2canvas from 'html2canvas';
import { CopyIcon, DownloadIcon } from 'lucide-react';
import {
  type ComponentProps,
  type ReactNode,
  type RefObject,
  useState,
} from 'react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

type ChartSettingsProps = {
  customSettings?: ReactNode;
  formAction?: () => void;
};

function ChartSettings({ customSettings, formAction }: ChartSettingsProps) {
  return (
    <>
      <form action={formAction}>
        <div className="grid gap-4">
          {customSettings ? (
            <>
              <div className="grid gap-4">{customSettings}</div>
              <Separator />
            </>
          ) : null}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Chart Bar Settings</h3>
              <p className="text-sm text-muted-foreground">
                Escolha as configurações para o gráfico de barra.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="board-statuses">Exibir status do board</Label>
              <ToggleGroup
                type="multiple"
                variant="outline"
                className="w-full grid grid-cols-3 gap-3"
              >
                {boardStatuses.map(status => (
                  <ToggleGroupItem
                    key={status}
                    name="board-statuses"
                    value={status}
                    defaultChecked
                    className="!border-[1px] capitalize"
                  >
                    {status}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="board-statuses">Exibir times do board</Label>
              <ToggleGroup
                type="multiple"
                variant="outline"
                className="w-full grid grid-cols-3 gap-3"
              >
                {presetedTeams.map(team => (
                  <ToggleGroupItem
                    key={team}
                    name="board-statuses"
                    value={team}
                    defaultChecked
                    className="!border-[1px] capitalize"
                  >
                    {team}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Chart Display</h3>
              <p className="text-sm text-muted-foreground">
                Escolha as configurações para o gráfico de barra.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="chart-bar-type">Bar Chart Type</Label>

              <RadioGroup
                name="chart-bar-type"
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grouped" id="grouped" />
                  <Label htmlFor="grouped" className="font-normal">
                    Grouped (columns side by side)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stacked" id="stacked" />
                  <Label htmlFor="stacked" className="font-normal">
                    Stacked (columns stacked on top of each other)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-row gap-2 items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="grid"
                    className="flex flex-col items-start gap-1"
                  >
                    Grid Lines
                    <p className="text-[0.8rem] text-muted-foreground">
                      Show grid lines on the chart
                    </p>
                  </Label>
                </div>
                <Switch id="grid" />
              </div>

              <div className="flex flex-row gap-2 items-center justify-between rounded-lg border p-3 shadow-sm">
                <Label
                  htmlFor="legend"
                  className="flex flex-col items-start gap-1"
                >
                  Legend
                  <p className="text-[0.8rem] text-muted-foreground">
                    Show legend below the chart
                  </p>
                </Label>
                <Switch id="legend" />
              </div>
            </div>
          </div>
        </div>
      </form>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Apply Settings</Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}

type ExportSettingsProps = {
  chartRef: RefObject<HTMLDivElement>;
};

function ExportSettings({ chartRef }: ExportSettingsProps) {
  async function handleExportToClipboard() {
    if (!chartRef?.current) {
      toast.error('Export failed', {
        description: 'Could not find chart element to export',
      });
      return;
    }

    try {
      toast.info('Preparing chart for export', {
        description: 'Converting chart to image...',
      });

      const canvas = await html2canvas(chartRef.current);

      canvas.toBlob(blob => {
        if (blob) {
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        }
      });

      toast.success('Chart ready for Google Presentation', {
        description:
          'The chart image has been copied to your clipboard. You can now paste it into your Google Presentation.',
      });
    } catch (error) {
      toast.error('Export failed', {
        description: 'An error occurred while exporting the chart',
      });
    }
  }

  async function handleDownloadImage() {
    if (!chartRef?.current) {
      toast.error('Export failed', {
        description: 'Could not find chart element to export',
      });
      return;
    }

    try {
      toast.info('Preparing chart for export', {
        description: 'Converting chart to image...',
      });

      const canvas = await html2canvas(chartRef.current);

      const link = document.createElement('a');
      link.download = 'sprint-chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Chart image ready', {
        description: 'The chart image has been downloaded to your computer.',
      });
    } catch (error) {
      toast.error('Export failed', {
        description: 'An error occurred while exporting the chart',
      });
    }
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Export to Google Presentation</h3>
        <p className="text-xs text-muted-foreground">
          Export your chart as an image that can be pasted into Google Slides.
        </p>

        <div className="rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Export Options</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleExportToClipboard}
              >
                <CopyIcon className="size-3 mr-1" />
                Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleDownloadImage}
              >
                <DownloadIcon className="size-3 mr-1" />
                Download Image
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium">Instructions</h4>
            <ol className="text-xs space-y-1 list-decimal list-inside">
              <li>Click "Copy to Clipboard" or "Download Image"</li>
              <li>Open your Google Presentation</li>
              <li>Click where you want to insert the chart</li>
              <li>Paste the image (Ctrl+V or Edit &gt; Paste)</li>
              <li>Resize or position as needed</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

type ChartSettingsEditorProps = ComponentProps<typeof Sheet> & {
  chartName: string;
  chartType: 'line' | 'bar' | 'pie';
  customSettings?: ReactNode;
  formAction?: () => void;
  chartRef: RefObject<HTMLDivElement>;
};

export function ChartSettingsEditor({
  children,
  chartName,
  chartType,
  customSettings,
  formAction,
  chartRef,
  ...rest
}: ChartSettingsEditorProps) {
  const [activeTab, setActiveTab] = useState('settings');
  return (
    <Sheet {...rest}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>{chartName}</SheetTitle>
          <SheetDescription>
            Configure the settings for the {chartType} chart
          </SheetDescription>
        </SheetHeader>

        <Tabs
          className="w-full px-3"
          defaultValue="settings"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="flex-1 overflow-y-auto">
            <ChartSettings
              customSettings={customSettings}
              formAction={formAction}
            />
          </TabsContent>

          <TabsContent value="export" className="flex-1 overflow-y-auto">
            <ExportSettings chartRef={chartRef} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

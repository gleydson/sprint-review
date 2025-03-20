import { BoardSelector } from './board-selector';
import { ModeToggle } from './mode-toggle';
import { ProjectSelector } from './project-selector';
import { SprintSelector } from './sprint-selector';
import { ThemeSelector } from './theme-selector';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export async function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <ProjectSelector />
        <Separator orientation="vertical" className="!h-6" decorative />
        <BoardSelector />
        <Separator orientation="vertical" className="!h-6" decorative />
        <SprintSelector />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/gleydson/sprint-review"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
          <ThemeSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

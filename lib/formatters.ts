import type { BarChartConfig } from '@/components/bar-chart';
import type { TotalsByStatusData } from '@/components/totals-by-status';
import {
  type BoardStatus,
  boardStatuses,
  possibleMobileTeams,
  presetedTeams,
} from './config';
import type { Issue, Sprint } from './definitions';

export type GroupedIssues = {
  [team: string]: {
    [status: string]: Array<{
      key: string;
      summary: string;
      type: string;
    }>;
  };
};

const TEAM_REGEX = /\[(.*?)\]/;

function extractTeam(summary: string): string {
  const match = summary.match(TEAM_REGEX);
  return match ? match[1].toLowerCase() : 'no-team';
}

export function issuesToBarChartData(issues: Issue[]) {
  if (!issues.length) {
    return { data: [], config: {} };
  }

  const groupedIssues = groupIssuesByTeamAndStatus(issues);
  const allStatus = extractAllStatusesByGroupedIssues(groupedIssues);
  const data = allStatus.map(status => {
    return mergeObjects<TotalsByStatusData>(
      // @ts-ignore
      { status },
      ...Object.keys(groupedIssues).map(team => {
        return {
          [team]: groupedIssues[team][status]?.length ?? 0,
        };
      }),
    );
  });

  const config = mergeObjects<BarChartConfig>(
    ...Object.keys(groupedIssues).map((team, idx) => ({
      [team]: {
        label: team,
        color: `var(--chart-${idx + 1})`,
      },
    })),
  );

  return {
    data,
    config,
  };
}

interface IssueTime {
  key: string;
  type: string;
  timeOpenMs: number | null;
  timeOpenDays: number | null;
}

export function calculateIssueTimesForSprint(
  issues: Issue[],
  sprint: Sprint,
): Record<string, IssueTime[]> {
  const categorizedIssues: Record<string, IssueTime[]> = {};
  const sprintStart = sprint.startDate ? new Date(sprint.startDate) : null;
  const sprintEnd = sprint.endDate ? new Date(sprint.endDate) : null;

  for (const issue of issues) {
    const type = issue.fields.issuetype.name;
    const created = new Date(issue.fields.created);
    let start = created;

    const resolution = issue.fields.resolutiondate
      ? new Date(issue.fields.resolutiondate)
      : null;

    // Checa se a issue foi criada antes do início do sprint e limita o início do cálculo ao início do sprint
    if (sprintStart && created < sprintStart) {
      start = sprintStart;
    }
    let end = resolution;
    if (resolution && sprintEnd && resolution > sprintEnd) {
      end = sprintEnd;
    }

    const timeOpenMs =
      end && end >= start ? end.getTime() - start.getTime() : 0;
    const timeOpenDays = timeOpenMs
      ? Math.round((timeOpenMs / (1000 * 60 * 60 * 24)) * 10) / 10
      : 0;

    const issueTime: IssueTime = {
      key: issue.key,
      type,
      timeOpenMs,
      timeOpenDays,
    };

    if (!categorizedIssues[type]) {
      categorizedIssues[type] = [];
    }
    categorizedIssues[type].push(issueTime);
  }

  return categorizedIssues;
}

export function prepareProgressData(issues: Issue[], sprint: Sprint) {
  const sprintStart = new Date(sprint.startDate);
  const sprintEnd = new Date(sprint.endDate);
  const daysCount =
    Math.ceil(
      (sprintEnd.getTime() - sprintStart.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;
  const days = Array.from({ length: daysCount }, (_, i) => {
    const date = new Date(sprintStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  return days.map(day => {
    const resolvedCount = issues.filter(issue => {
      const resolution = issue.fields.resolutiondate
        ? new Date(issue.fields.resolutiondate)
        : null;
      return resolution && resolution <= day && resolution >= sprintStart;
    }).length;

    return {
      date: day.toISOString().split('T')[0],
      resolved: resolvedCount,
    };
  });
}

export function getIssuesByCreationTime(issues: Issue[], sprint: Sprint) {
  const sprintStartDate = new Date(sprint.startDate);

  const openedWithSprint = issues.filter(issue => {
    const createdDate = new Date(issue.fields.created);
    return createdDate <= sprintStartDate;
  }).length;

  const createdAfterStart = issues.filter(issue => {
    const createdDate = new Date(issue.fields.created);
    return createdDate > sprintStartDate;
  }).length;

  return {
    openedWithSprint,
    createdAfterStart,
  };
}

export function prepareSimpleBarData(result: Record<string, IssueTime[]>) {
  return Object.entries(result).map(([type, times]) => {
    const validTimes = times
      .filter(t => t.timeOpenDays !== null)
      .map(t => t.timeOpenDays);
    const mean = validTimes.length
      ? validTimes.filter(v => v != null).reduce((sum, t) => sum + t, 0) /
        validTimes.length
      : 0;
    return { type, mean };
  });
}

const statusMapping: Record<string, BoardStatus> = {
  'sprint backlog': 'backlog',
  'ready for development': 'backlog',
  'ready for dev': 'backlog',
  'to do': 'backlog',
  'in progress': 'dev',
  'in dev': 'dev',
  'in development': 'dev',
  'in review': 'code review',
  'waiting for review': 'code review',
  homologação: 'homolog',
  homologation: 'homolog',
  'waiting for test': 'homolog',
  'waiting for deploy': 'deploy',
  'waiting for release': 'deploy',
  'waiting for merge': 'deploy',
  cancelado: 'cancelled',
};

function normalizeStatus(status: string): BoardStatus {
  const normalized = status.toLowerCase().trim();

  if (boardStatuses.includes(normalized as BoardStatus)) {
    return normalized as BoardStatus;
  }

  const mappedStatus = statusMapping[normalized];
  if (mappedStatus) {
    return mappedStatus;
  }

  return 'backlog';
}

export function groupIssuesByTeamAndStatus(issues: Issue[]): GroupedIssues {
  const groupedIssues: GroupedIssues = {};

  for (const issue of issues) {
    const extractedTeam = extractTeam(issue.fields.summary).toLowerCase();
    const team = presetedTeams.includes(extractedTeam)
      ? extractedTeam
      : possibleMobileTeams.includes(extractedTeam)
        ? 'mobile'
        : 'no team';
    const status = normalizeStatus(issue.fields.status.name);

    if (team === 'no team') {
      continue;
    }

    if (!groupedIssues[team]) {
      groupedIssues[team] = {};
    }

    if (!groupedIssues[team][status]) {
      groupedIssues[team][status] = [];
    }

    groupedIssues[team][status].push({
      key: issue.key,
      summary: issue.fields.summary,
      type: issue.fields.issuetype.name,
    });
  }

  return groupedIssues;
}

function sortStatuses(a: BoardStatus, b: BoardStatus): number {
  return boardStatuses.indexOf(a) - boardStatuses.indexOf(b);
}

export function extractAllStatusesByGroupedIssues(
  groupedIssues: GroupedIssues,
): string[] {
  const uniqueValues = Object.values(groupedIssues).reduce(
    (acc: Set<string>, team) => {
      const statuses = Object.keys(team);
      for (const status of statuses) {
        acc.add(status);
      }
      return acc;
    },
    new Set<string>(),
  );

  return Array.from(uniqueValues).map(normalizeStatus).sort(sortStatuses);
}

export function mergeObjects<T extends object>(...objects: T[]): T {
  return objects.reduce((acc, obj) => {
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    return { ...acc, ...obj };
  }, {} as T);
}

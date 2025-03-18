import type { BarChartConfig, BarChartData } from '@/components/bar-chart';

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

export const presetedTeams = ['backend', 'web', 'mobile'];
const possibleMobileTeams = ['mobile', 'ios', 'android', 'stone', 'ton'];

type Issue = {
  key: string;
  fields: {
    summary: string;
    issuetype: {
      name: string;
    };
    status: {
      name: string;
    };
  };
};

export function issuesToBarChartData(issues: Issue[]) {
  if (!issues.length) {
    return { data: [], config: {} };
  }

  const groupedIssues = groupIssuesByTeamAndStatus(issues);
  const allStatus = extractAllStatusesByGroupedIssues(groupedIssues);
  const data = allStatus.map(status => {
    return mergeObjects<BarChartData>(
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
        color: `hsl(var(--chart-${idx + 1}))`,
      },
    })),
  );

  return {
    data,
    config,
  };
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
    const status = issue.fields.status.name.toLowerCase();

    // if (team === 'no-team') {
    //   continue;
    // }

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

function sortStatuses(a: string, b: string): number {
  const order = [
    'backlog',
    'sprint backlog',
    'ready for development',
    'ready for dev',
    'to do',
    'in progress',
    'in dev',
    'in development',
    'in review',
    'code review',
    'in review',
    'homologation',
    'homolog',
    'done',
    'waiting for review',
    'waiting for test',
    'waiting for deploy',
    'waiting for release',
    'waiting for merge',
  ];
  return order.indexOf(a) - order.indexOf(b);
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

  return Array.from(uniqueValues);
}

export function mergeObjects<T extends object>(...objects: T[]): T {
  return objects.reduce((acc, obj) => {
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    return { ...acc, ...obj };
  }, {} as T);
}

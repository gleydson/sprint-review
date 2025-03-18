import { ProjectTable } from '@/components/project-table';
import { getProjects } from '@/lib/jira-api';

const JIRA_API_KEY =
  'ATATT3xFfGF0px3I00MLX_0c-BY-DqGcFNeWuKdFRWMweMAJYaam7p9DgJtjXNvif_sTeRRofoM7MMMRxajUNxmKPjLmfqLT_2gxeL9OKRuwiX0GewUeiUDjr-5DCeNooWU02ljy79A_k7QbVOD0GGXQ23JV5UQYKOOeY5Jmk5gF4hDWWIaFUCE=05255D94';
const EMAIL = 'gleydson.rodrigues@stone.com.br';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    per_page?: string;
    page?: string;
    orderBy?: 'key' | 'name';
  }>;
}) {
  const {
    q: query = '',
    per_page: perPage = '10',
    page = '1',
    orderBy,
  } = await searchParams;
  // const sprints = await getSprints(6470) // delay
  // const sprints = await getSprints(6444)
  // console.log('sprints', sprints)
  // const sprint = await getSprint(6444, 16182)
  // const issues = await getBoardIssuesForSprint(6444, 16182);
  // console.log('issues', issues);
  // const boardConfig = await getBoardConfiguration(6444);
  // const { data, config } = issuesToBarChartData(
  //   issues.issues
  // );
  // const data = await getProject('19127');
  const data = await getProjects({
    query,
    maxResults: Number(perPage),
    startAt: Number(perPage) * (Number(page) - 1),
    orderBy,
  });

  return (
    <>
      <ProjectTable data={data.values} rowCount={data.total} />
    </>
  );
}

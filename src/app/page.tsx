import TimeTable from '@/components/time-table';
import { getDepartures } from '@/services/departures';

// As the page is rarely used,
// we don't want stale data during revalidation.
// Instead we add our own caching mechanism.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getDepartures();

  return (
    <main>
      <TimeTable result={result} />
    </main>
  );
}

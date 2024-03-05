import TimeTable from '@/components/time-table';
import { getDepartures } from '@/services/departures';

// As the page is rarely used,
// we don't want stale data during revalidation.
// Instead we add our own caching mechanism.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { oberi, winti } = await getDepartures();

  return (
    <main className="flex w-full snap-x snap-mandatory overflow-auto">
      <div className="w-full shrink-0 snap-start">
        <TimeTable result={oberi} />
      </div>
      <div className="w-full shrink-0 snap-start">
        <TimeTable result={winti} />
      </div>
    </main>
  );
}

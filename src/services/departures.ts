import { routeResultSchema, type RouteResult } from '@/schema/swiss-public-transport-api';

const oberwinterthurStopId = '8506016';
const winterthurStopId = '8506000';

let routeResultCache:
  | {
      oberi: RouteResult;
      winti: RouteResult;
    }
  | undefined;

const fetchDetparures = async ({ from, to }: { from: string; to: string }) => {
  const url = new URL('https://search.ch/timetable/api/route.json');
  url.searchParams.set('show_delays', '0');
  url.searchParams.set('transportation_types', 'train');
  url.searchParams.set('from', from);
  url.searchParams.set('to', to);
  url.searchParams.set('interest_duration', '14400');
  url.searchParams.set('num', '30');

  const response = await (await fetch(url.toString(), { cache: 'no-store' })).json();

  console.log(JSON.stringify(response, null, 2));

  return routeResultSchema.parse(response);
};

export const getDepartures = async () => {
  if (routeResultCache) {
    return routeResultCache;
  }

  const [oberi, winti] = await Promise.all([
    fetchDetparures({ from: oberwinterthurStopId, to: winterthurStopId }),
    fetchDetparures({ from: winterthurStopId, to: oberwinterthurStopId }),
  ]);

  routeResultCache = { oberi, winti };

  setTimeout(
    () => {
      routeResultCache = undefined;
    },
    1000 * 60 * 5,
  );

  return routeResultCache;
};

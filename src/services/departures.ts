import { routeResultSchema, type RouteResult } from '@/schema/swiss-public-transport-api';

const oberwinterthurStopId = '8506016';
const winterthurStopId = '8506000';

let routeResultCache: RouteResult | undefined;

export const getDepartures = async () => {
  if (routeResultCache) {
    return routeResultCache;
  }

  const url = new URL('https://search.ch/timetable/api/route.json');
  url.searchParams.set('show_delays', '0');
  url.searchParams.set('transportation_types', 'train');
  url.searchParams.set('from', oberwinterthurStopId);
  url.searchParams.set('to', winterthurStopId);
  url.searchParams.set('interest_duration', '14400');
  url.searchParams.set('num', '30');

  const response = await fetch(url.toString(), { cache: 'no-store' });

  routeResultCache = routeResultSchema.parse(await response.json());

  setTimeout(
    () => {
      routeResultCache = undefined;
    },
    1000 * 60 * 5,
  );

  return routeResultCache;
};

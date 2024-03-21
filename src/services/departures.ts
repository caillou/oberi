import * as OJP from 'ojp-sdk';
import { TripsRequestParams } from 'ojp-sdk/lib/request/trips-request/trips-request-params';

import { routeResultSchema, type RouteResult } from '@/schema/swiss-public-transport-api';

const oberwinterthurStopId = '8506016';
const winterthurStopId = '8506000';

let routeResultCache:
  | {
      oberi: RouteResult;
      winti: RouteResult;
    }
  | undefined;

export const fetchDeparturesFromOJP = async ({ from, to }: { from: string; to: string }) => {
  const requestParams = TripsRequestParams.initWithLocationsAndDate(
    OJP.Location.initWithStopPlaceRef(from),
    OJP.Location.initWithStopPlaceRef(to),
    new Date(),
  );

  if (!requestParams) {
    throw new Error('Invalid request params');
  }
  requestParams.includeLegProjection = false;

  const tripRequest = new OJP.TripRequest(OJP.DEFAULT_STAGE, requestParams);

  if (!tripRequest) {
    throw new Error('Invalid trip request');
  }

  // console.log(JSON.stringify(await tripRequest.fetchResponse(), null, 2));
  console.log(await tripRequest.fetchResponse());

  return tripRequest.fetchResponse();
};

const fetchDetparures = async ({ from, to }: { from: string; to: string }) => {
  // const url = new URL('https://search.ch/timetable/api/route.json');
  // url.searchParams.set('show_delays', '0');
  // url.searchParams.set('transportation_types', 'train');
  // url.searchParams.set('from', from);
  // url.searchParams.set('to', to);
  // url.searchParams.set('interest_duration', '14400');
  // url.searchParams.set('num', '30');

  // const response = await (await fetch(url.toString(), { cache: 'no-store' })).json();

  // console.log(JSON.stringify(response, null, 2));

  // return routeResultSchema.parse(response);
  const response = await fetchDeparturesFromOJP({ from, to });

  console.log(Object.keys(response));
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

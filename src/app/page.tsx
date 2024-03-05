import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';

import ZurichIcon from '@/components/zurich-icon';
import { routeResultSchema, type STrainLeg } from '@/schema/swiss-public-transport-api';

dayjs.extend(durationPlugin);
dayjs.extend(timezonePlugin);
dayjs.extend(utcPlugin);

const oberwinterthurStopId = '8506016';
const winterthurStopId = '8506000';
const transportationTypes = 'train';
const showDelays = 0;

function LineIcon({ line }: { line: string }) {
  return (
    <span className="flex aspect-square w-12 items-center justify-center rounded-md bg-[#039] font-display text-white">
      {line}
    </span>
  );
}

function durationTillDeparture({ now, departure }: { now: dayjs.Dayjs; departure: dayjs.Dayjs }) {
  const duration = dayjs.duration(departure.diff(now));
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (minutes < 0) {
    return `0'`;
  }

  return hours > 0 ? duration.format("H[h]mm[']") : `${minutes}'`;
}

const goesToZurich = (leg: STrainLeg) => !!leg.terminal.match(/zürich|aarau/i);

export default async function Home() {
  const rawJson = await (
    await fetch(
      `https://search.ch/timetable/api/route.json?show_delays=${showDelays}&transportation_types=${transportationTypes}&from=${oberwinterthurStopId}&to=${winterthurStopId}&interest_duration=14400&num=30`,
      {
        next: {
          revalidate: 60,
        },
      },
    )
  ).json();

  const result = routeResultSchema.parse(rawJson);
  const now = dayjs.tz(undefined, 'Europe/Zurich');

  return (
    <main>
      <ul>
        {result.connections.map((connection) => {
          const [leg] = connection.legs;

          if (leg.type === 'walk') {
            return undefined;
          }

          const departure = dayjs.tz(connection.departure, 'Europe/Zurich');

          return (
            <li key={connection.departure} className="m-2 my-4 flex items-center space-x-2">
              <LineIcon line={leg.line} />
              <div className="grow">
                <div className="font-medium">{leg.terminal}</div>
                <div className="text-sm">{departure.format('HH:mm')}</div>
              </div>

              {goesToZurich(leg) && <ZurichIcon className="h-6" />}

              <div className="text-xl">{durationTillDeparture({ now, departure })}</div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

'use client';

import dayjs from 'dayjs';
import durationPlugin, { type Duration } from 'dayjs/plugin/duration';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import ZurichIcon from '@/components/zurich-icon';
import type { RouteResult, STrainLeg } from '@/schema/swiss-public-transport-api';

dayjs.extend(durationPlugin);
dayjs.extend(timezonePlugin);
dayjs.extend(utcPlugin);

function LineIcon({ line }: { line: string }) {
  return (
    <span className="flex aspect-square w-12 items-center justify-center rounded-md bg-[#039] font-display text-white">
      {line}
    </span>
  );
}

function durationTillDeparture({ now, departure }: { now: dayjs.Dayjs; departure: dayjs.Dayjs }) {
  return dayjs.duration(departure.diff(now));
}

const formatDuration = (duration: Duration) => {
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (seconds < 0) {
    return `0'`;
  }

  if (hours === 0 && minutes < 6) {
    return duration.format('m:ss');
  }

  return hours > 0 ? duration.format("H[h]mm[']") : `${minutes}'`;
};

const goesToZurich = (leg: STrainLeg) => !!leg.terminal.match(/zürich|aarau/i);

const zurichTime = (timeString?: string) => dayjs.tz(timeString, 'Europe/Zurich');

function TimeTable({ result }: { result: RouteResult }) {
  const [now, setNow] = useState(zurichTime());

  useInterval(() => setNow(zurichTime()), 1000);

  return (
    <ul>
      {result.connections.map((connection) => {
        const [leg] = connection.legs;

        if (leg.type === 'walk') {
          return undefined;
        }

        const departure = zurichTime(connection.departure);
        const timeLeft = durationTillDeparture({ now, departure });

        const timeLeftInMinutes = timeLeft.asMinutes();

        if (timeLeftInMinutes < -1) {
          return undefined;
        }

        return (
          <li key={connection.departure} className="m-2 my-4 flex items-center space-x-2">
            <LineIcon line={leg.line} />
            <div className="grow">
              <div className="font-medium">{leg.terminal}</div>
              <div className="text-sm">
                {departure.format('HH:mm')}, Gleis {leg.track}
              </div>
            </div>

            {goesToZurich(leg) && <ZurichIcon className="h-6" />}

            <div className="text-xl">{formatDuration(timeLeft)}</div>
          </li>
        );
      })}
    </ul>
  );
}

export default TimeTable;

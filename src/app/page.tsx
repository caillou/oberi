import { z } from 'zod';

const legSchema = z.tuple([
  z.object({
    line: z.string(),
    terminal: z.string(),
  }),
  z.object({}),
]);

const connectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  departure: z.coerce.date(),
  arrival: z.coerce.date(),
  duration: z.number(),
  // dep_delay: z.string(),
  legs: legSchema,
});

const resultSchema = z.object({
  connections: connectionSchema.array(),
});

const oberwinterthurStopId = '8506016';
const winterthurStopId = '8506000';
const transportationTypes = 'train';
const showDelays = 0;

export default async function Home() {
  const rawJson = await (
    await fetch(
      `https://search.ch/timetable/api/route.json?show_delays=${showDelays}&transportation_types=${transportationTypes}&from=${oberwinterthurStopId}&to=${winterthurStopId}&interest_duration=14400&num=30`,
      {
        next: {
          revalidate: 120,
        },
      },
    )
  ).json();

  const result = resultSchema.parse(rawJson);

  return (
    <main>
      <h1>hello</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}

import { z } from 'zod';

const sTrainLegSchema = z.object({
  type: z.literal('strain'),
  line: z.string(),
  terminal: z.string(),
  track: z.string(),
});

const nightSTrainLegSchema = z.object({
  type: z.literal('night_strain'),
  line: z.string(),
  terminal: z.string(),
  track: z.string(),
});

type STrainLeg = z.infer<typeof sTrainLegSchema>;
type NightSTrainLeg = z.infer<typeof nightSTrainLegSchema>;
export type TrainLeg = Omit<STrainLeg | NightSTrainLeg, 'type'>;

const legSchema = z.tuple([
  z.discriminatedUnion('type', [
    sTrainLegSchema,
    nightSTrainLegSchema,
    z.object({
      type: z.literal('walk'),
    }),
  ]),
  z.object({}),
]);

const connectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  departure: z.string(),
  arrival: z.coerce.date(),
  duration: z.number(),
  // dep_delay: z.string(),
  legs: legSchema,
});

export const routeResultSchema = z.object({
  connections: connectionSchema.array(),
});

export type RouteResult = z.infer<typeof routeResultSchema>;

import { z } from 'zod';

const sTrainLegSchema = z.object({
  type: z.literal('strain'),
  line: z.string(),
  terminal: z.string(),
});

export type STrainLeg = z.infer<typeof sTrainLegSchema>;

const legSchema = z.tuple([
  z.discriminatedUnion('type', [
    sTrainLegSchema,
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

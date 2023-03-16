import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { buildNextAuthOptions } from "../auth/[...nextAuth].api";

/**
 * A schema representing the request body to add time intervals
 * @type {import('zod').ZodObject}
 * */
const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
});

/**
 * Handles requests to add time intervals for a user
 * @param {NextApiRequest} req - The request object
 * @param {NextApiResponse} res - The response object
 * @returns {Promise<void>} - A promise that resolves with void when the function completes
 * */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(401).end();
  }

  // Parse the request body to get the time intervals
  const { intervals } = timeIntervalsBodySchema.parse(req.body);

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      });
    })
  );

  return res.status(201).end();
}

import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

/**
 * Retrieves the available and possible appointment times for a user on a given date
 * @function
 * @async
 * @param {NextApiRequest} req - The request object
 * @param {NextApiResponse} res - The response object
 * @returns {Promise} The response object containing the available and possible appointment times
 * */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date no provided." });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User does not exist." });
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(new Date());

  // If the provided date is in the past, return an empty array of possible and available times
  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  // Retrieve the user's availability for the day of the provided date from the database
  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  // If the user is not available on the provided date, return an empty array of possible and available times

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  // Calculate the start and end hour of the user's availability
  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  // Generate an array of possible appointment times based on the user's availability
  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i;
    }
  );

  // Retrieve all blocked appointment times for the user on the provided date from the database
  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
  });

  // Filter the possible appointment times to get the available appointment times
  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time
    );

    const isTimeInPast = referenceDate.set("hour", time).isBefore(new Date());

    return !isTimeBlocked && !isTimeInPast;
  });

  return res.json({ possibleTimes, availableTimes });
}

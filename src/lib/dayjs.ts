import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Sets the Day.js locale based on the user's location.
 */
function setLocale() {
  const date = new Date();
  const locale = getLocale(date);

  dayjs.locale(locale.toLowerCase());
}

/**
 * Determines the user's locale based on the user's time zone.
 * @param {Date} date - The date to use for determining the locale.
 * @returns {string} The locale code for the user's location.
 */
function getLocale(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date
    .toLocaleDateString(undefined, options)
    .split(" ")[0]
    .toLowerCase();
}

setLocale();

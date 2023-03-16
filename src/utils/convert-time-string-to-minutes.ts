/**
 * Converts a time string in the format "hh:mm" to a total number of minutes.
 * @param timeString - The time string to convert.
 * @returns The total number of minutes represented by the time string.
 */
export function convertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number)

  return hours * 60 + minutes
}

/**
 * Interface for the parameters of the getWeekDays function.
 */
interface GetWeekDaysParams {
  short?: boolean
}

/**
 * Returns an array with the names of the week days in the specified language.
 * @param short - If true, returns the abbreviated form of the week days.
 * @returns An array of week day names.
 */
export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('en', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}

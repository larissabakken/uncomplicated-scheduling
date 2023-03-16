import { useState } from "react";
import { CalendarStep } from "./CalendarStep";
import { ConfirmStep } from "./ConfirmStep";

/**
 * A component that renders a scheduling form with two steps: a calendar step to select a date,
 * and a confirmation step to confirm the scheduling and fill out personal information.
 * @returns The rendered ScheduleForm component
 */
export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  /**
   * Clears the selected date and time, and sets the selectedDateTime state to null
   */
  function handleClearSelectedDateTime() {
    setSelectedDateTime(null);
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
      />
    );
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />;
}

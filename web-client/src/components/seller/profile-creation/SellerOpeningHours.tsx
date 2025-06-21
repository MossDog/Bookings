import { WeekSchedule } from "@/types/types";
import { days } from "@/utils/availability";
import { Dispatch, SetStateAction } from "react";

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const ampm = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute} ${ampm}`;
});

interface SellerOpeningHoursProps {
  schedule: WeekSchedule;
  setSchedule: Dispatch<SetStateAction<WeekSchedule>>;
}

export default function SellerOpeningHours({
  schedule,
  setSchedule,
}: SellerOpeningHoursProps) {
  const handleTimeChange = (
    dayId: string,
    field: "openTime" | "closeTime",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value,
      },
    }));
  };

  const handleAddBreak = (dayId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        breaks: [
          ...prev[dayId].breaks,
          { startTime: "12:00 PM", endTime: "1:00 PM" },
        ],
      },
    }));
  };

  const handleRemoveBreak = (dayId: string, breakIndex: number) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        breaks: prev[dayId].breaks.filter((_, index) => index !== breakIndex),
      },
    }));
  };

  const handleBreakTimeChange = (
    dayId: string,
    breakIndex: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        breaks: prev[dayId].breaks.map((breakTime, index) =>
          index === breakIndex ? { ...breakTime, [field]: value } : breakTime,
        ),
      },
    }));
  };

  const handleToggleClosed = (dayId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        isClosed: !prev[dayId].isClosed,
      },
    }));
  };

  return (
    <div className="card bg-base-100 shadow-md h-full">
      <div className="bg-base-200/50 p-6 border-b border-base-200">
        <h3 className="text-xl font-semibold text-base-content">
          Opening Hours
        </h3>
        <p className="text-base-content/70 text-sm mt-1">
          Set your business hours and break times for each day of the week
        </p>
      </div>

      <div className="card-body p-6 h-full overflow-hidden">
        <div className="flex overflow-x-auto h-full gap-4 pb-4 -mx-2 px-2 snap-x">
          {days.map((day) => (
            <div
              key={day.id}
              className="h-full card bg-base-200 w-[300px] flex-shrink-0 snap-start"
            >
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">{day.label}</span>
                  <button
                    onClick={() => handleToggleClosed(day.id)}
                    className={`btn btn-sm ${schedule[day.id].isClosed ? "btn-error hover:bg-error-content/10" : "btn-success hover:bg-success-content/10"}`}
                  >
                    {schedule[day.id].isClosed ? "Closed" : "Open"}
                  </button>
                </div>

                {schedule[day.id].isClosed ? (
                  <div className="flex flex-col items-center justify-center py-8 text-base-content/70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-3 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 2a8 8 0 018 8c0 4.418-3.582 8-8 8a8 8 0 01-8-8 8 8 0 018-8zM10 6v4l3 3"
                      />
                    </svg>
                    <p className="text-sm font-medium mb-1">
                      Closed on {day.label}s
                    </p>
                    <p className="text-xs">
                      No appointments available on this day
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Opening Time</span>
                      </label>
                      <select
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
                        value={schedule[day.id].openTime}
                        onChange={(e) =>
                          handleTimeChange(day.id, "openTime", e.target.value)
                        }
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Closing Time</span>
                      </label>
                      <select
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
                        value={schedule[day.id].closeTime}
                        onChange={(e) =>
                          handleTimeChange(day.id, "closeTime", e.target.value)
                        }
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="divider text-xs">Break Times</div>

                    {schedule[day.id].breaks.map((breakTime, index) => (
                      <div key={index} className="bg-base-100 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Break {index + 1}
                          </span>
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => handleRemoveBreak(day.id, index)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="form-control">
                            <select
                              className="select select-bordered select-sm w-full"
                              value={breakTime.startTime}
                              onChange={(e) =>
                                handleBreakTimeChange(
                                  day.id,
                                  index,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-control">
                            <select
                              className="select select-bordered select-sm w-full"
                              value={breakTime.endTime}
                              onChange={(e) =>
                                handleBreakTimeChange(
                                  day.id,
                                  index,
                                  "endTime",
                                  e.target.value,
                                )
                              }
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      className="btn btn-ghost btn-sm text-primary mt-2"
                      onClick={() => handleAddBreak(day.id)}
                    >
                      + Add Break Time
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

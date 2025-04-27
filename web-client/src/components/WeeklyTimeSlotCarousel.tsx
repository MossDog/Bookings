import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import React from 'react';

type TimeSlot = {
  time: string;
  available: boolean;
};

type WeekDay = {
  date: Date;
  dayName: string;
  dayNumber: number;
  month: string;
  timeSlots: TimeSlot[];
};

export default function WeeklyTimeSlotCarousel() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const generateTimeSlots = (dayIndex: number): TimeSlot[] => [
    { time: '09:00', available: dayIndex !== 5 && dayIndex !== 6 },
    { time: '10:30', available: dayIndex !== 6 },
    { time: '12:00', available: dayIndex === 1 || dayIndex === 3 },
    { time: '14:30', available: dayIndex !== 0 },
    { time: '16:00', available: true },
    { time: '17:30', available: dayIndex !== 2 },
  ].filter(() => Math.random() > 0.3);

  const generateWeekDays = (startDate: Date): WeekDay[] => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return {
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        timeSlots: generateTimeSlots(i),
      };
    });
  };

  const weekDays = useMemo(() => generateWeekDays(currentDate), [currentDate]);

  const goToPreviousWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const formatDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Select a Time Slot</h2>
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">{formatDateRange()}</span>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={goToPreviousWeek}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 px-8">
          {weekDays.map((day) => {
            const dayKey = `${day.month}-${day.dayNumber}`;
            return (
              <div 
                key={dayKey}
                className={`flex-shrink-0 w-36 rounded-2xl border overflow-hidden ${
                  selectedDay === dayKey ? 'border-blue-500 shadow-md' : 'border-gray-200'
                }`}
              >
                <div
                  onClick={() => {
                    setSelectedDay(dayKey);
                    setSelectedTime(null);
                  }}
                  className={`cursor-pointer py-2 text-center ${
                    selectedDay === dayKey ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="font-medium">{day.dayName}</div>
                  <div className="text-sm">{day.month} {day.dayNumber}</div>
                </div>

                <div className="p-2 flex flex-col gap-2">
                  {day.timeSlots.length > 0 ? (
                    day.timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        className={`
                          py-2 px-4 rounded-full text-sm transition
                          ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                            selectedDay === dayKey && selectedTime === slot.time
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">No slots</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={goToNextWeek}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {selectedDay && selectedTime && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Selected: <span className="font-medium">{selectedDay.replace('-', ' ')}</span> at <span className="font-medium">{selectedTime}</span>
          </p>
          <button className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
            Confirm Time Slot
          </button>
        </div>
      )}
    </div>
  );
}
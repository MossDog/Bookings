import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import supabase from '@/utils/supabase';
import { WorkingHours } from '@/types/types';

interface Props {
  sellerId: string;
  timezone: string;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function OpeningHoursWidget({ sellerId, timezone }: Props) {
  const [workingHours, setWorkingHours] = useState<Record<number, { start: string; end: string }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const rows = await fetchTable<WorkingHours>('seller_working_hours', {
          user_id: sellerId,
        });

        const grouped: Record<number, { start: string; end: string }> = {};
        rows.forEach(({ day_of_week, start_time, end_time }) => {
          grouped[day_of_week] = { start: start_time, end: end_time };
        });

        setWorkingHours(grouped);
      } catch (error) {
        console.error('Error loading working hours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingHours();
  }, [sellerId]);

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white">
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">Opening Hours</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : (
          <ul className="text-sm divide-y divide-gray-200">
            {daysOfWeek.map((day, idx) => {
              const hours = workingHours?.[idx];
              return (
                <li key={idx} className="flex justify-between py-2 text-gray-700">
                  <span className="w-1/2 font-medium">{day}</span>
                  {hours ? (
                    <span className="w-1/2 text-right text-primary font-medium">
                      {DateTime.fromFormat(hours.start, 'HH:mm:ss', { zone: timezone }).toFormat('hh:mm a')} –{' '}
                      {DateTime.fromFormat(hours.end, 'HH:mm:ss', { zone: timezone }).toFormat('hh:mm a')}
                    </span>
                  ) : (
                    <span className="w-1/2 text-right text-error font-medium">Closed</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

async function fetchTable<T>(table: string, match: Record<string, unknown>): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').match(match);
  if (error) throw new Error(error.message);
  return data as T[];
}
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import supabase from '@/utils/supabase';
import { WorkingHours } from '@/types/types';
import { Clock } from 'lucide-react';

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
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="card-title text-base-content m-0">Opening Hours</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="menu menu-xs bg-base-100 w-full p-0">
            {daysOfWeek.map((day, idx) => {
              const hours = workingHours?.[idx];
              const isToday = DateTime.now().weekday % 7 === idx;
              return (
                <li key={idx}>
                  <div className={`flex justify-between py-2 ${isToday ? 'bg-base-200 rounded-lg font-semibold' : ''}`}>
                    <span className="text-base-content">{day}</span>
                    {hours ? (
                      <span className="text-primary">
                        {DateTime.fromFormat(hours.start, 'HH:mm:ss', { zone: timezone }).toFormat('hh:mm a')} –{' '}
                        {DateTime.fromFormat(hours.end, 'HH:mm:ss', { zone: timezone }).toFormat('hh:mm a')}
                      </span>
                    ) : (
                      <span className="text-error">Closed</span>
                    )}
                  </div>
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
import { FC } from 'react';
import { DateRange } from '@/entities/admin/api/stats/types';
import { format } from 'date-fns';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={value.startDate}
        onChange={(e) => onChange({ ...value, startDate: e.target.value })}
        className="border rounded p-2"
      />
      <span>~</span>
      <input
        type="date"
        value={value.endDate}
        onChange={(e) => onChange({ ...value, endDate: e.target.value })}
        className="border rounded p-2"
      />
    </div>
  );
}; 
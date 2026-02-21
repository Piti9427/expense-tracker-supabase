export type DateRangeType = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface DateRange {
  startDate: string; // ISO string YYYY-MM-DD
  endDate: string;   // ISO string YYYY-MM-DD
  label: string;
}

export const getDateRange = (type: DateRangeType, offset: number = 0, customRange?: { start: string, end: string }): DateRange => {
  const now = new Date();
  let start = new Date();
  let end = new Date();
  let label = '';

  switch (type) {
    case 'day':
      start.setDate(now.getDate() + offset);
      end.setDate(now.getDate() + offset);
      label = start.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      break;
    case 'week':
      // เริ่มต้นที่วันจันทร์ของสัปดาห์
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7);
      start = new Date(now.setDate(diff));
      end = new Date(now.setDate(start.getDate() + 6));
      label = `${start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
      label = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      break;
    case 'year':
      start = new Date(now.getFullYear() + offset, 0, 1);
      end = new Date(now.getFullYear() + offset, 11, 31);
      label = start.getFullYear().toString();
      break;
    case 'custom':
      if (customRange) {
        start = new Date(customRange.start);
        end = new Date(customRange.end);
        label = `${start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
      }
      break;
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    label
  };
};

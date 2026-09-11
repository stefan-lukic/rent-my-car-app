const millisecondsPerDay = 24 * 60 * 60 * 1000;

const getUtcCalendarTime = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

export const formatCalendarDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseCalendarDate = (value: string | null) => {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

export const countInclusiveCalendarDays = (startDate: Date, endDate: Date) => {
  const startTime = getUtcCalendarTime(startDate);
  const endTime = getUtcCalendarTime(endDate);

  if (endTime < startTime) return 0;

  return Math.floor((endTime - startTime) / millisecondsPerDay) + 1;
};

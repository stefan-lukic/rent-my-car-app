const millisecondsPerDay = 24 * 60 * 60 * 1000;

const getUtcCalendarTime = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

export const formatCalendarDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const countInclusiveCalendarDays = (startDate: Date, endDate: Date) => {
  const startTime = getUtcCalendarTime(startDate);
  const endTime = getUtcCalendarTime(endDate);

  if (endTime < startTime) return 0;

  return Math.floor((endTime - startTime) / millisecondsPerDay) + 1;
};

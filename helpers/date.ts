const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const formatBirthday = (dateInput: Date | string | undefined | null): string => {
  if (!dateInput) {
    return '';
  }

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const day = date.getDate();
  const year = date.getFullYear();

  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  return `${month}, ${day}${getDaySuffix(day)} ${year}`;
};

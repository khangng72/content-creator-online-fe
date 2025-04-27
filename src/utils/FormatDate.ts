export const formatDate = (input: string): string => {
  const date = new Date(input);

  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' }); // "Mar"
  const day = date.getDate();

  const daySuffix = getDaySuffix(day);

  return `${day}${daySuffix} ${month} ${year}`;
};

const getDaySuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return 'th';
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

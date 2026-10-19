const pad = (value: number) => String(value).padStart(2, "0");

const toDate = (date: Date) =>
  `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
const toTime = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

// List cells show the time for today's posts and the date otherwise.
export function formatListDate(iso: string, now = new Date()) {
  const date = new Date(iso);
  return toDate(date) === toDate(now) ? toTime(date) : toDate(date);
}

export const formatDateTime = (iso: string) =>
  `${toDate(new Date(iso))} ${toTime(new Date(iso))}`;

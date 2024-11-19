// Format: YYYY-MM-DD HH:MM:SS
export function formatDatetime(date: Date | string) {
  if (typeof date == "string") {
    return date.slice(0, 19).replace('T', ' ');
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Format: YYYY-MM-DD
export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Format: YYYYMMDD
export function formatFloatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

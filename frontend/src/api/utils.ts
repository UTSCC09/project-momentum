export function formatDatetime(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
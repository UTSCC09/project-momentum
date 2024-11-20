import moment from 'moment';
// replace evertime you see new Date() with moment()
console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

// Format: YYYY-MM-DD HH:MM:SS
export function formatDatetime(date: Date | string) {
  if (typeof date == "string") {
    return date.slice(0, 19).replace('T', ' ');
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Format: YYYY-MM-DD
export function formatDate(date: Date | string) {
  if (typeof date == "string") {
    return new Date(date).toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

// Format: YYYYMMDD
export function formatFloatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

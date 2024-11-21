import moment from 'moment';

// Format: YYYY-MM-DD HH:MM:SS
export function formatDatetime(date: Date | string) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

// Format: YYYY-MM-DD
export function formatDate(date: Date | string) {
  return moment(date).format('YYYY-MM-DD');
}

// Format: YYYYMMDD
export function formatFloatDate(date: Date) {
  return moment(date).format('YYYYMMDD');
}

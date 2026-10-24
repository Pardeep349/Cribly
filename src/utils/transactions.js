/** Create the short demo transaction IDs used by the History page. */
export function createTransactionId(prefix) {
  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Format timestamps in the app's existing local YYYY-MM-DD HH:mm format. */
export function formatTransactionTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${datePart} ${timePart}`;
}
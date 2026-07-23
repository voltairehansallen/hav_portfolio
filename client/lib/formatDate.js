export function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
}

export function toDateInputValue(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().slice(0, 10);
}

export function toISODateTime(dateInputValue) {
  if (!dateInputValue) return null;
  return new Date(`${dateInputValue}T00:00:00.000Z`).toISOString();
}

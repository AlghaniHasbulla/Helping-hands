export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

export function dispatchAuthEvent() {
  // Dispatch without payload to trigger storage re-read
  window.dispatchEvent(new CustomEvent('auth-change'));
}
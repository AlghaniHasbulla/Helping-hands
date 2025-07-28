export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

export const dispatchAuthEvent = (user) => {
  const event = new CustomEvent('auth-change', {
    detail: { user }
  });
  window.dispatchEvent(event);
};
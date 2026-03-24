export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getCategoryIcon(category) {
  const icons = {
    Electronics: '📱',
    Bags: '🎒',
    Documents: '📄',
    Keys: '🔑',
    Clothing: '👕',
    'Personal Items': '🧴',
    Books: '📚',
    Accessories: '⌚',
    Other: '📦',
  };
  return icons[category] || '📦';
}

export const CATEGORIES = [
  { value: 'Electronics', icon: '📱' },
  { value: 'Bags', icon: '🎒' },
  { value: 'Documents', icon: '📄' },
  { value: 'Keys', icon: '🔑' },
  { value: 'Clothing', icon: '👕' },
  { value: 'Personal Items', icon: '🧴' },
  { value: 'Books', icon: '📚' },
  { value: 'Accessories', icon: '⌚' },
  { value: 'Other', icon: '📦' },
];

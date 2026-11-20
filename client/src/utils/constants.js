export const STATUSES = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const SEVERITIES = ["low", "medium", "high", "critical"];
export const PRIORITIES = ["low", "medium", "high"];

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const labelOf = (value) =>
  STATUSES.find((s) => s.value === value)?.label ?? capitalize(value);

export const formatDate = (date) => new Date(date).toLocaleDateString();

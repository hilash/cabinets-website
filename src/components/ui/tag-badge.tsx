interface TagBadgeProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
}

export function TagBadge({ tag, active, onClick }: TagBadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors";
  const colors = active
    ? "bg-accent text-white"
    : "bg-accent-bg text-accent hover:bg-accent-bg-subtle";
  const clickable = onClick ? "cursor-pointer" : "";

  return (
    <span className={`${base} ${colors} ${clickable}`} onClick={onClick}>
      {tag}
    </span>
  );
}

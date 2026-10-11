export function StatusChip({ tone = "neutral", children, dot = true }) {
  const color = tone === "success" ? "bg-success-soft text-success" : "bg-line-2 text-ink-2";
  return <span className={`chip ${dot ? "chip-dot" : ""} ${color}`}>{children}</span>;
}


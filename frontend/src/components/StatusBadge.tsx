import React from "react";

const STYLES = {
  ATIVO: {
    bg: "bg-[#D1EFE4]",
    text: "text-[#0A5C40]",
    border: "border-[#A3E0C9]",
    dot: "bg-[#0E7955]",
    label: "Ativo",
  },
  POTENCIAL: {
    bg: "bg-[#FEF0C7]",
    text: "text-[#93370D]",
    border: "border-[#FDEC98]",
    dot: "bg-[#B54708]",
    label: "Potencial",
  },
};

export const StatusBadge = ({ value }) => {
  const s = STYLES[value] || {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
    label: value || "—",
  };
  return (
    <span
      data-testid={`status-badge-${(value || "none").toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

export default StatusBadge;

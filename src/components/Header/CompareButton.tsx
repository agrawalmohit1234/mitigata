import React from "react";

interface CompareButtonProps {
  count: number;
  onClick?: () => void;
}

export function CompareButton({ count, onClick }: CompareButtonProps) {
  return (
    <button className="compare-button" onClick={onClick}>
      Compare
      {count > 0 && <span className="badge">{count}</span>}
    </button>
  );
}

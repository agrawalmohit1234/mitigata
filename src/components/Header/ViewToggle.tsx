import React from "react";

interface ViewToggleProps {
  value: "grid" | "list";
  onChange?: (value: "grid" | "list") => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="View toggle">
      <button
        className={value === "grid" ? "active" : ""}
        onClick={() => onChange?.("grid")}
      >
        Grid
      </button>
      <button
        className={value === "list" ? "active" : ""}
        onClick={() => onChange?.("list")}
      >
        List
      </button>
    </div>
  );
}

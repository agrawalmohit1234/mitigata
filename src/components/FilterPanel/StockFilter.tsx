import React from "react";

const OPTIONS = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
] as const;

interface StockFilterProps {
  selected: string[];
  toggle: (key: "stock", value: string) => void;
}

export function StockFilter({ selected, toggle }: StockFilterProps) {
  return (
    <section className="filter-section">
      <h3>Stock Status</h3>
      {OPTIONS.map((label) => (
        <label key={label} className="checkbox-row">
          <input
            type="checkbox"
            checked={selected.includes(label)}
            onChange={() => toggle("stock", label)}
          />
          <span>{label}</span>
        </label>
      ))}
    </section>
  );
}

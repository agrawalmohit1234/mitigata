import React from "react";

const OPTIONS = [
  { label: "5 stars", value: 5 },
  { label: "4+ stars", value: 4 },
  { label: "3+ stars", value: 3 },
  { label: "All", value: 0 },
];

interface RatingFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <section className="filter-section">
      <h3>Rating</h3>
      {OPTIONS.map((option) => (
        <label key={option.label} className="radio-row">
          <input
            type="radio"
            name="rating"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
          <span className="stars">{"★".repeat(option.value || 5)}</span>
        </label>
      ))}
    </section>
  );
}

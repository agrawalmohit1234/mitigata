import React from "react";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

interface ResultsHeaderProps {
  totalFiltered: number;
  totalAll: number;
  visible: number;
  sort: string;
  onSortChange: (value: string) => void;
}

export function ResultsHeader({ totalFiltered, totalAll, visible, sort, onSortChange }: ResultsHeaderProps) {
  return (
    <div className="results-header">
      <div>
        <p className="results-title">
          Showing {visible} of {totalFiltered}
          {totalAll !== totalFiltered && <span className="muted"> (Total {totalAll})</span>}
        </p>
      </div>
      <div className="sort-control">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value === sort ? `✓ ${option.label}` : option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

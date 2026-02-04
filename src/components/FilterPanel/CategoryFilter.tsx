import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selected: string[];
  counts: Record<string, number>;
  toggle: (key: "categories", value: string) => void;
}

export function CategoryFilter({ categories, selected, counts, toggle }: CategoryFilterProps) {
  return (
    <section className="filter-section">
      <h3>Categories</h3>
      {categories.map((category) => (
        <label key={category} className="checkbox-row">
          <input
            type="checkbox"
            checked={selected.includes(category)}
            onChange={() => toggle("categories", category)}
          />
          <span>{category}</span>
          <span className="muted">{counts[category] || 0}</span>
        </label>
      ))}
    </section>
  );
}

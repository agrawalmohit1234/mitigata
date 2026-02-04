import React from "react";

interface BrandFilterProps {
  brands: string[];
  selected: string[];
  counts: Record<string, number>;
  toggle: (key: "brands", value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function BrandFilter({ brands, selected, counts, toggle, searchValue, onSearchChange }: BrandFilterProps) {
  return (
    <section className="filter-section">
      <h3>Brands</h3>
      <input
        className="brand-search"
        type="text"
        value={searchValue}
        placeholder="Search brands..."
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search brands"
      />
      <div className="brand-list">
        {brands.map((brand) => (
          <label key={brand} className="checkbox-row">
            <input
              type="checkbox"
              checked={selected.includes(brand)}
              onChange={() => toggle("brands", brand)}
            />
            <span>{brand}</span>
            <span className="muted">{counts[brand] || 0}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

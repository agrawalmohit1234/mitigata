import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "../../utils/format";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

export function PriceRangeFilter({ min, max, valueMin, valueMax, onChange }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDisabled = max <= min;
  const safeMax = isDisabled ? min + 1 : max;

  useEffect(() => {
    if (valueMin !== localMin) setLocalMin(valueMin);
    if (valueMax !== localMax) setLocalMax(valueMax);
  }, [valueMin, valueMax, localMin, localMax]);

  const scheduleChange = useCallback((nextMin: number, nextMax: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onChange(nextMin, nextMax);
    }, 100);
  }, [onChange]);

  useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const rangeStyle = useMemo(() => {
    if (!max) return {};
    const left = (localMin / max) * 100;
    const right = 100 - (localMax / max) * 100;
    return { left: `${left}%`, right: `${right}%` } as React.CSSProperties;
  }, [localMin, localMax, max]);

  return (
    <section className="filter-section">
      <h3>Price Range</h3>
      <div className="price-range">
        <div className="range-track">
          <span className="range-progress" style={rangeStyle} />
        </div>
        <input
          type="range"
          min={min}
          max={safeMax}
          value={localMin}
          disabled={isDisabled}
          onChange={(event) => {
            const next = clamp(Number(event.target.value), min, localMax - 1);
            setLocalMin(next);
            scheduleChange(next, localMax);
          }}
        />
        <input
          type="range"
          min={min}
          max={safeMax}
          value={localMax}
          disabled={isDisabled}
          onChange={(event) => {
            const next = clamp(Number(event.target.value), localMin + 1, safeMax);
            setLocalMax(next);
            scheduleChange(localMin, next);
          }}
        />
      </div>
      <div className="price-inputs">
        <input
          type="number"
          value={localMin}
          min={min}
          max={localMax}
          disabled={isDisabled}
          onChange={(event) => {
            const next = clamp(Number(event.target.value), min, localMax);
            setLocalMin(next);
            scheduleChange(next, localMax);
          }}
        />
        <span>to</span>
        <input
          type="number"
          value={localMax}
          min={localMin}
          max={safeMax}
          disabled={isDisabled}
          onChange={(event) => {
            const next = clamp(Number(event.target.value), localMin, safeMax);
            setLocalMax(next);
            scheduleChange(localMin, next);
          }}
        />
      </div>
      <p className="range-label">${localMin} - ${localMax}</p>
    </section>
  );
}

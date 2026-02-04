import React, { useCallback, useEffect, useRef, useState } from "react";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onChange,
}: DateRangeFilterProps) {
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (startDate === "") {
      setLocalStart("");
    }
    if (endDate === "") {
      setLocalEnd("");
    }
  }, [startDate, endDate]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const scheduleChange = useCallback(
    (start: string, end: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onChange(start, end);
      }, 100);
    },
    [onChange],
  );

  return (
    <section className="filter-section">
      <h3>Date Range</h3>
      <div className="price-inputs">
        <input
          type="date"
          value={localStart}
          onChange={(event) => {
            setLocalStart(event.target.value);
            scheduleChange(event.target.value, localEnd);
          }}
        />
        <span>to</span>
        <input
          type="date"
          value={localEnd}
          onChange={(event) => {
            setLocalEnd(event.target.value);
            scheduleChange(localStart, event.target.value);
          }}
        />
      </div>
      <p className="range-label">
        ${localStart} - ${localEnd}
      </p>
    </section>
  );
}

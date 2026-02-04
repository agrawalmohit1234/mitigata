import { useEffect, useMemo, useRef, useState } from "react";

export function useVirtualGrid({
  itemCount,
  rowHeight,
  columnCount,
  overscan = 2,
}: {
  itemCount: number;
  rowHeight: number;
  columnCount: number;
  overscan?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const onScroll = () => setScrollTop(container.scrollTop);
    const onResize = () => setHeight(container.clientHeight);

    onResize();
    container.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const rowCount = Math.ceil(itemCount / columnCount);

  const { startRow, endRow } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleEnd = Math.min(
      rowCount - 1,
      Math.ceil((scrollTop + height) / rowHeight)
    );

    return {
      startRow: Math.max(0, visibleStart - overscan),
      endRow: Math.min(rowCount - 1, visibleEnd + overscan),
    };
  }, [scrollTop, rowHeight, height, overscan, rowCount]);

  const paddingTop = startRow * rowHeight;
  const paddingBottom = (rowCount - endRow - 1) * rowHeight;

  return {
    containerRef,
    startRow,
    endRow,
    paddingTop,
    paddingBottom,
    rowCount,
  };
}

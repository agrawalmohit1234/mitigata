import React, { useMemo } from "react";
import { Header } from "../components/Header/Header";
import { useProducts } from "../hooks/useProducts";

interface HistogramBin {
  label: string;
  count: number;
}

const Histogram = ({
  bins,
  maxCount,
}: {
  bins: HistogramBin[];
  maxCount: number;
}) => {
  const width = 720;
  const height = 220;
  const padding = 30;
  const barWidth = (width - padding * 2) / bins.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#c7bfb2"
      />
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#c7bfb2"
      />
      {bins.map((bin, index) => {
        const barHeight = (bin.count / maxCount) * (height - padding * 2);
        return (
          <g key={bin.label}>
            <rect
              x={padding + index * barWidth + 6}
              y={height - padding - barHeight}
              width={barWidth - 12}
              height={barHeight}
              fill="#0f766e"
              rx="6"
              style={{ animationDelay: `${index * 60}ms` }}
              className="bar"
            />
            <text
              x={padding + index * barWidth + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#6e6a64"
            >
              {bin.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

interface Segment {
  label: string;
  value: number;
  color: string;
}

const PieChart = ({ segments }: { segments: Segment[] }) => {
  const size = 240;
  const radius = 90;
  const center = size / 2;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  let cumulative = 0;

  const polarToCartesian = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180.0);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="chart">
      {segments.map((seg, index) => {
        const startAngle = (cumulative / total) * 360;
        cumulative += seg.value;
        const endAngle = (cumulative / total) * 360;
        const start = polarToCartesian(endAngle);
        const end = polarToCartesian(startAngle);
        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
        const d = [
          "M",
          center,
          center,
          "L",
          start.x,
          start.y,
          "A",
          radius,
          radius,
          0,
          largeArcFlag,
          0,
          end.x,
          end.y,
          "Z",
        ].join(" ");

        return (
          <path
            key={seg.label}
            d={d}
            fill={seg.color}
            className="slice"
            style={{ animationDelay: `${index * 80}ms` }}
          />
        );
      })}
    </svg>
  );
};

const RatingBars = ({
  ratings,
  avg,
}: {
  ratings: { label: string; count: number }[];
  avg: number;
}) => {
  const width = 520;
  const height = 200;
  const padding = 30;
  const barWidth = (width - padding * 2) / ratings.length;
  const maxCount = Math.max(...ratings.map((r) => r.count), 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#c7bfb2"
      />
      {ratings.map((rating, index) => {
        const barHeight = (rating.count / maxCount) * (height - padding * 2);
        return (
          <g key={rating.label}>
            <rect
              x={padding + index * barWidth + 8}
              y={height - padding - barHeight}
              width={barWidth - 16}
              height={barHeight}
              fill="#d97706"
              rx="6"
              className="bar"
              style={{ animationDelay: `${index * 70}ms` }}
            />
            <text
              x={padding + index * barWidth + barWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#6e6a64"
            >
              {rating.label}
            </text>
          </g>
        );
      })}
      <text
        x={width - padding}
        y={padding - 6}
        textAnchor="end"
        fontSize="12"
        fill="#6e6a64"
      >
        Avg {avg.toFixed(2)}
      </text>
    </svg>
  );
};

const Gauge = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) => {
  const size = 180;
  const radius = 70;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total ? value / total : 0;
  const dashOffset = circumference - ratio * circumference;

  return (
    <div className="gauge">
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#eee7dd"
          strokeWidth="14"
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="gauge-ring"
          style={{ "--gauge-offset": dashOffset } as React.CSSProperties}
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          fill="#1f1f1f"
        >
          {Math.round(ratio * 100)}%
        </text>
      </svg>
      <p>{label}</p>
      <span className="muted">{value} products</span>
    </div>
  );
};

export function Analytics() {
  const { products } = useProducts(100);

  const priceBins = useMemo(() => {
    const step = 100;
    const max = 1000;
    const bins = Array.from({ length: max / step }, (_, idx) => ({
      label: `$${idx * step}-${(idx + 1) * step}`,
      count: 0,
    }));
    products.forEach((product) => {
      const index = Math.min(Math.floor(product.price / step), bins.length - 1);
      bins[index].count += 1;
    });
    return bins;
  }, [products]);

  const maxCount = Math.max(...priceBins.map((bin) => bin.count), 1);

  const categorySegments = useMemo<Segment[]>(() => {
    const counts: Record<string, number> = {};
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    const colors = [
      "#0f766e",
      "#f59e0b",
      "#d97706",
      "#7c3aed",
      "#2563eb",
      "#db2777",
    ];
    return Object.entries(counts).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    }));
  }, [products]);

  const ratingDistribution = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((value) => ({
      label: `${value}★`,
      count: 0,
    }));
    products.forEach((product) => {
      const rounded = Math.round(product.rating);
      const bucket = buckets.find((b) => b.label === `${rounded}★`);
      if (bucket) bucket.count += 1;
    });
    const avg =
      products.reduce((sum, product) => sum + product.rating, 0) /
      (products.length || 1);
    return { buckets, avg };
  }, [products]);

  const stockCounts = useMemo(() => {
    const inStock = products.filter((product) => product.stock > 20).length;
    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 20,
    ).length;
    const outStock = products.filter((product) => product.stock === 0).length;
    return { inStock, lowStock, outStock };
  }, [products]);

  const totalProducts = products.length || 1;

  return (
    <div className="app">
      <Header showControls={false} />
      <div className="analytics">
        <section className="analytics-card">
          <div className="card-header">
            <h2>Price Distribution</h2>
            <p className="muted">Histogram of {products.length} products</p>
          </div>
          <Histogram bins={priceBins} maxCount={maxCount} />
        </section>

        <section className="analytics-card">
          <div className="card-header">
            <h2>Category Breakdown</h2>
            <p className="muted">Share of catalog by category</p>
          </div>
          <div className="chart-row">
            <PieChart segments={categorySegments} />
            <div className="legend">
              {categorySegments.map((seg) => (
                <div key={seg.label} className="legend-row">
                  <span
                    className="legend-swatch"
                    style={{ background: seg.color }}
                  />
                  <span>{seg.label}</span>
                  <span className="muted">
                    {Math.round((seg.value / totalProducts) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="analytics-card">
          <div className="card-header">
            <h2>Rating Distribution</h2>
            <p className="muted">
              Average rating {ratingDistribution.avg.toFixed(2)}
            </p>
          </div>
          <RatingBars
            ratings={ratingDistribution.buckets}
            avg={ratingDistribution.avg}
          />
        </section>

        <section className="analytics-card">
          <div className="card-header">
            <h2>Stock Levels</h2>
            <p className="muted">Inventory health summary</p>
          </div>
          <div className="gauge-row">
            <Gauge
              label="In Stock"
              value={stockCounts.inStock}
              total={totalProducts}
              color="#16a34a"
            />
            <Gauge
              label="Low Stock"
              value={stockCounts.lowStock}
              total={totalProducts}
              color="#f59e0b"
            />
            <Gauge
              label="Out of Stock"
              value={stockCounts.outStock}
              total={totalProducts}
              color="#dc2626"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

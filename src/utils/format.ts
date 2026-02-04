export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

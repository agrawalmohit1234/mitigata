import React from "react";

interface CheckoutButtonProps {
  count: number;
  onClick?: () => void;
}

export function CheckoutButton({ count, onClick }: CheckoutButtonProps) {
  return (
    <button
      className="compare-button"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      Checkout
      <span className="badge">{count}</span>
    </button>
  );
}

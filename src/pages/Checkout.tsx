import React from "react";
import { Header } from "../components/Header/Header";
import { useProductContext } from "../context/ProductContext";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductGrid/ProductCard";

export function Checkout() {
  const { products } = useProducts(100);
  const { checkoutIds } = useProductContext();

  const checkoutProduct = products.filter((product) =>
    checkoutIds.includes(product.id),
  );

  const recommendedCategory = checkoutProduct.map((ele) => ele.category);

  const recommendedProduct = products.filter((product) =>
    recommendedCategory.includes(product.category),
  );

  const totalPrice = checkoutProduct.reduce((acc, curr) => {
    acc += Math.ceil(curr.price);
    console.log(curr.price);
    return acc;
  }, 0);

  return (
    <div className="app">
      <Header showControls={false} />
      <div>
        {checkoutProduct.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            view="list"
            onSelect={() => {}}
            onCompareToggle={() => {}}
            onCheckout={() => {}}
            isCompared={false}
            isCheckout={false}
            searchTerm=""
            isFavorite={false}
            onToggleFavorite={() => {}}
            isSavingFavorite={false}
            disableAddToCart={true}
            disableFavourite={true}
            disableCompare={true}
          />
        ))}
      </div>
      <div className="flex-end">
        <div className="totalPrice">Total Price: ${totalPrice}</div>
      </div>
      <div className="recommend">Recommend Product</div>
      <div>
        {recommendedProduct.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            view="list"
            onSelect={() => {}}
            onCompareToggle={() => {}}
            onCheckout={() => {}}
            isCompared={false}
            isCheckout={false}
            searchTerm=""
            isFavorite={false}
            onToggleFavorite={() => {}}
            isSavingFavorite={false}
            disableAddToCart={true}
            disableFavourite={true}
            disableCompare={true}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { StoreProduct } from "@/types";
import { useCart } from "./CartProvider";

export function AddToBagButton({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <div className="inline-flex items-center border border-ink/25 bg-ivory-light">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="px-4 py-3.5 text-ink/70 transition-colors hover:text-ink"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <span className="min-w-[2.75rem] text-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          aria-label="Increase quantity"
          className="px-4 py-3.5 text-ink/70 transition-colors hover:text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="btn-gold flex-1 sm:flex-initial"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" aria-hidden />
            Added to Bag
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Add to Selection Bag
          </>
        )}
      </button>
    </div>
  );
}

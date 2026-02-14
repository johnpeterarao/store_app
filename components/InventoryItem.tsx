"use client";

import { useState } from "react";
import { Product } from "../types";

interface Props {
  product: Product;
  onChange: (id: string, quantity: number) => void;
}

export default function InventoryItem({ product, onChange }: Props) {
  // selected increment/decrement amount
  const [step, setStep] = useState(1);

  const handleIncrease = () => {
    onChange(product.id, product.stock + step);
  };

  const handleDecrease = () => {
    onChange(product.id, Math.max(product.stock - step, 0));
  };

  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="mb-2 font-mono">{product.name}</h3>

      {/* Step Selector */}
      <div className="flex gap-2 mb-3">
        {[1, 5, 10].map((val) => (
          <div
            key={val}
            onClick={() => setStep(val)}
            className={`px-3 py-1 rounded cursor-pointer border font-mono ${
              step === val
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
            }`}
          >
            {val}
          </div>
        ))}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleDecrease}
          className="px-4 py-1 bg-red-500 text-4xl text-white rounded hover:bg-red-600"
        >
        -
        </button>

        <span className="text-lg font-bold font-mono">{product.stock}</span>

        <button
          onClick={handleIncrease}
          className="px-4 py-1 bg-green-500 text-4xl text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
}

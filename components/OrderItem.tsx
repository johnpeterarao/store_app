"use client";

import { useEffect, useState } from "react";
import { MenuItem } from "../types";

interface Props {
  menu: MenuItem;
  selected: boolean;
  existingQuantity?: number;
  onSelect: () => void;
  onSave: (quantity: number) => void;
  onRemove: () => void;
}

export default function OrderItem({
  menu,
  selected,
  existingQuantity,
  onSelect,
  onSave,
  onRemove,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (existingQuantity) {
      setQuantity(existingQuantity);
    }
  }, [existingQuantity]);

  const increase = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const decrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div
      onClick={!selected ? onSelect : undefined}
      className={`border p-4 rounded cursor-pointer flex flex-col justify-between transition ${
        selected
          ? "bg-blue-100 border-blue-500 ring-2 ring-blue-400"
          : "hover:bg-gray-100"
      }`}
    >
      <div>
        <h3 className="font-semibold font-mono">{menu.name}</h3>
        <p className="font-mono font-semibold">${menu.price}</p>
      </div>

      {selected && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={decrease}
              className="px-4 py-1 bg-red-500 text-4xl text-white rounded hover:bg-red-600"
            >
              -
            </button>

            <span className="w-8 text-center font-mono font-bold">
              {quantity}
            </span>

            <button
              onClick={increase}
              className="px-4 py-1 bg-green-500 text-4xl text-white rounded hover:bg-green-600"
            >
              +
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(quantity);
              }}
              className="flex-1 bg-green-600 text-white py-2 rounded font-mono"
            >
              {existingQuantity ? "Update Item" : "Place Item"}
            </button>

            {existingQuantity && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded font-mono"
              >
                Remove Item
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

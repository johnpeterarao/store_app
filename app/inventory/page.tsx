"use client";

import { useEffect, useState } from "react";
import { initialInventory } from "@/data/invetory";
import { Product } from "../../types";
import { getInventory, setInventory } from "../../utils/inventory";
import InventoryItem from "../../components/InventoryItem";

export default function InventoryPage() {
  const [inventory, setInventoryState] = useState<Product[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // For new product input
  const [newProductName, setNewProductName] = useState("");
  const [newProductStock, setNewProductStock] = useState<number>(0);

  useEffect(() => {
    const stored = getInventory();
    if (stored.length === 0) {
      setInventoryState(initialInventory);
    } else {
      setInventoryState(stored);
    }
  }, []);

  // Update quantity for existing product
  const handleQuantityChange = (id: string, quantity: number) => {
    const updated = inventory.map((item) =>
      item.id === id ? { ...item, stock: quantity } : item
    );

    setInventoryState(updated);
    setIsDirty(true);
  };

  // Save current inventory to localStorage
  const handleSave = () => {
    setInventory(inventory);
    setIsDirty(false);
  };

  // Add new product to inventory
  const handleAddProduct = () => {
    if (!newProductName.trim()) return;

    const newProduct: Product = {
      id: Date.now().toString(), // simple unique id
      name: newProductName.trim(),
      stock: newProductStock,
    };

    const updatedInventory = [...inventory, newProduct];
    setInventoryState(updatedInventory);
    setInventory(updatedInventory); // save immediately to localStorage
    setNewProductName("");
    setNewProductStock(0);
    setIsDirty(false); // new product is already saved
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Inventory</h1>

        {/* Add New Product */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            placeholder="New product name"
            className="px-4 py-2 border rounded-md flex-1"
          />
          <input
            type="number"
            value={newProductStock}
            onChange={(e) => setNewProductStock(Number(e.target.value))}
            placeholder="Stock"
            className="px-4 py-2 border rounded-md w-full"
          />
          <button
            onClick={handleAddProduct}
            className="px-6 py-2 w-full bg-green-600 text-white rounded-md font-medium transition hover:bg-green-700"
          >
            Add Product
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <InventoryItem
              key={item.id}
              product={item}
              onChange={handleQuantityChange}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`w-full px-6 py-3 rounded-md font-medium transition ${
              isDirty
                ? "bg-[#273572] text-white shadow-md font-mono"
                : "bg-gray-300 text-gray-500 cursor-not-allowed font-mono"
            }`}
          >
            Save Products
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { menuList } from "../../data/menu";
import { MenuItem, Order } from "../../types";
import { updateInventoryStock } from "../../utils/inventory";
import { addOrder } from "../../utils/orders";
import OrderItem from "../../components/OrderItem";

export default function OrderPage() {
  const [cart, setCart] = useState<{ menu: MenuItem; quantity: number }[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<"online" | "instore">("instore");

  const handleAddOrUpdate = (menu: MenuItem, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu.id === menu.id);

      if (existing) {
        return prev.map((item) =>
          item.menu.id === menu.id ? { ...item, quantity } : item
        );
      }

      return [...prev, { menu, quantity }];
    });
  };

  const handleRemoveFromCart = (menuId: string) => {
    setCart((prev) => prev.filter((item) => item.menu.id !== menuId));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.menu.price * item.quantity,
    0
  );

  const generateOrderId = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}/${pad(
      now.getHours()
    )}/${pad(now.getMinutes())}/${pad(now.getSeconds())}`;
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    // Update inventory stock
    cart.forEach((cartItem) => {
      cartItem.menu.ingredients.forEach((ing) => {
        updateInventoryStock(ing.productId, ing.quantity * cartItem.quantity);
      });
    });

    // Save order with menuName included
    const order: Order = {
      id: generateOrderId(),
      items: cart.map((item) => ({
        menuId: item.menu.id,
        menuName: item.menu.name, // <-- save the name
        quantity: item.quantity,
      })),
      totalPrice,
      date: new Date().toISOString(),
      orderType,
    };

    addOrder(order);

    // ✅ Reset UI
    setCart([]);
    setSelectedMenuId(null);
    setOrderType("instore");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          {menuList.map((menu) => {
            const existing = cart.find((item) => item.menu.id === menu.id);

            return (
              <OrderItem
                key={menu.id}
                menu={menu}
                selected={selectedMenuId === menu.id}
                existingQuantity={existing?.quantity}
                onSelect={() => setSelectedMenuId(menu.id)}
                onSave={(qty) => handleAddOrUpdate(menu, qty)}
                onRemove={() => handleRemoveFromCart(menu.id)}
              />
            );
          })}
        </div>

        {/* Cart / Order Summary */}
        {cart.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4 font-mono">Order Summary</h2>

            {cart.map((item) => (
              <div key={item.menu.id} className="flex justify-between font-mono mb-2">
                <span>
                  {item.menu.name} x {item.quantity}
                </span>
                <span>${item.menu.price * item.quantity}</span>
              </div>
            ))}

            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>

            <div className="mt-4">
              <label className="block mb-1 font-mono">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as "online" | "instore")}
                className="border p-2 rounded w-full"
              >
                <option value="instore">In-store</option>
                <option value="online">Online</option>
              </select>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded font-mono text-lg"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

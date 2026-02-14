"use client";

import { useEffect, useState, useMemo } from "react";
import { getInventory } from "../../utils/inventory";
import { getOrders } from "../../utils/orders";
import ReportItem from "../../components/ReportItem";
import { Product, Order, MenuItem } from "../../types";
import { menuList } from "@/data/menu";

export default function ReportPage() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [showTodayReport, setShowTodayReport] = useState(false);
  const [todaySales, setTodaySales] = useState(0);
  const [todayIngredients, setTodayIngredients] = useState<Record<string, number>>({});
  const [todaySalesByType, setTodaySalesByType] = useState<Record<string, number>>({});

  useEffect(() => {
    const inv = getInventory();
    const ord = getOrders();

    setInventory(inv);
    setOrders(ord);
    setMounted(true);
  }, []);

  const ordersByDate: Record<string, Order[]> = useMemo(() => {
    const grouped: Record<string, Order[]> = {};
    orders.forEach((order) => {
      const [day, month, year] = order.id.split("/");
      const dateKey = `${year}-${month}-${day}`;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(order);
    });
    return grouped;
  }, [orders]);

  if (!mounted) return null;

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const formatDateHeading = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-");
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const generateTodayReport = () => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const todayOrders = ordersByDate[todayKey] || [];

    // Total sales
    const totalSales = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Sales grouped by order type
    const salesByType: Record<string, number> = {};
    todayOrders.forEach(order => {
      if (!salesByType[order.orderType]) salesByType[order.orderType] = 0;
      salesByType[order.orderType] += order.totalPrice;
    });

    // Ingredient usage
    const ingredientUsage: Record<string, number> = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        const menuItem: MenuItem | undefined = menuList.find(m => m.id === item.menuId);
        if (!menuItem) return;

        menuItem.ingredients.forEach(ingredient => {
          const product = inventory.find(p => p.id === ingredient.productId);
          if (!product) return;

          if (!ingredientUsage[product.name]) ingredientUsage[product.name] = 0;
          ingredientUsage[product.name] += ingredient.quantity * item.quantity;
        });
      });
    });

    setTodaySales(totalSales);
    setTodayIngredients(ingredientUsage);
    setTodaySalesByType(salesByType);
    setShowTodayReport(true);
  };

  const displayedDates = Object.keys(ordersByDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orders Report</h1>
          <div className="flex gap-2">
            <button
              onClick={generateTodayReport}
              className="px-4 py-2 bg-blue-600 text-white rounded font-mono"
            >
              Report Today
            </button>
          </div>
        </div>

        {/* List of orders grouped by date */}
        {displayedDates
          .sort((a, b) => (a < b ? 1 : -1))
          .map((dateKey) => {
            const dayOrders = ordersByDate[dateKey];
            const totalSalesForDay = dayOrders.reduce(
              (sum, order) => sum + order.totalPrice,
              0
            );

            return (
              <section key={dateKey} className="mb-6">
                <h2 className="text-xl font-bold mb-1 font-mono flex justify-between items-center">
                  <span>{formatDateHeading(dateKey)} Sales</span>
                  <span className="text-lg font-semibold">
                    Total: ₱{totalSalesForDay}
                  </span>
                </h2>

                <ul className="space-y-2">
                  {dayOrders
                    .sort((a, b) => (a.id < b.id ? 1 : -1))
                    .map((order) => {
                      const totalItems = order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      );

                      const isExpanded = expandedOrder === order.id;

                      return (
                        <li
                          key={order.id}
                          className="border rounded p-3 bg-white"
                        >
                          <div
                            className="flex justify-between cursor-pointer"
                            onClick={() => toggleExpand(order.id)}
                          >
                            <span className="font-mono font-semibold">
                              Order {order.id} ({order.orderType})
                            </span>
                            <span className="font-mono">
                              ₱
                              <span className="font-semibold">
                                {order.totalPrice} ({totalItems} items)
                              </span>
                            </span>
                          </div>

                          {isExpanded && (
                            <div className="mt-2 pl-4 space-y-1">
                              {order.items.map((item) => (
                                <ReportItem
                                  key={item.menuId}
                                  name={
                                    inventory.find(
                                      (p) => p.id === item.menuId
                                    )?.name || item.menuName
                                  }
                                  value={item.quantity}
                                />
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </section>
            );
          })}
      </div>

      {/* TODAY REPORT MODAL */}
      {showTodayReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-mono">
                Today's Report
              </h2>
              <button
                onClick={() => setShowTodayReport(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Sales by Order Type */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Sales by Order Type:</h3>
              {Object.keys(todaySalesByType).length === 0 ? (
                <p className="text-gray-500">No orders today.</p>
              ) : (
                <ul className="space-y-1 font-mono">
                  {Object.entries(todaySalesByType).map(([type, amount]) => (
                    <li key={type} className="flex justify-between">
                      <span>{type}</span>
                      <span>₱{amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ingredients Usage */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Ingredients Used:</h3>
              {Object.keys(todayIngredients).length === 0 ? (
                <p className="text-gray-500">No ingredients used today.</p>
              ) : (
                <ul className="space-y-1 font-mono">
                  {Object.entries(todayIngredients).map(([name, qty]) => (
                    <li key={name} className="flex justify-between">
                      <span>{name}</span>
                      <span>{qty} pcs</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Total Sales */}
            <div className="flex justify-between mt-4 font-mono text-lg">
              <span>Total Sales:</span>
              <span className="font-semibold">₱{todaySales.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Order } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "./localStorage";

const ORDER_KEY = "orders";

export const getOrders = (): Order[] => {
  return getFromLocalStorage<Order[]>(ORDER_KEY) || [];
};

export const addOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  saveToLocalStorage(ORDER_KEY, orders);
};

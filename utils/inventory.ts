import { Product } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "./localStorage";

const INVENTORY_KEY = "inventory";

export const getInventory = (): Product[] => {
  const data = getFromLocalStorage<Product[]>(INVENTORY_KEY);
  return data || [];
};

export const setInventory = (inventory: Product[]) => {
  saveToLocalStorage(INVENTORY_KEY, inventory);
};

export const updateInventoryStock = (productId: string, quantity: number) => {
  const inventory = getInventory();
  const updated = inventory.map((item) =>
    item.id === productId ? { ...item, stock: item.stock - quantity } : item
  );
  setInventory(updated);
};

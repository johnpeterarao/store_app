import { MenuItem } from "../types";

export const menuList: MenuItem[] = [
  {
    id: "m1",
    name: "B1T1 Classic Burger",
    price: 48,
    ingredients: [
      { productId: "p2", quantity: 2 },
      { productId: "p5", quantity: 2 }
    ],
  },
  {
    id: "m2",
    name: "BigZ Burger",
    price: 158,
    ingredients: [
      { productId: "p1", quantity: 1 },
      { productId: "p7", quantity: 1 },
      { productId: "p4", quantity: 1 },
    ],
  },
  {
    id: "m3",
    name: "Double BigZ Burger",
    price: 228,
    ingredients: [
      { productId: "p1", quantity: 1 },
      { productId: "p7", quantity: 1 },
      { productId: "p4", quantity: 2 },
    ],
  },
];

export interface Product {
  id: string;
  name: string;
  stock: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  ingredients: { productId: string; quantity: number }[];
}

export interface Order {
  id: string;
  items: { menuId: string; quantity: number, menuName: string}[];
  totalPrice: number;
  date: string;
  orderType: string;
}

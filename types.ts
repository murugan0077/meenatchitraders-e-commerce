
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

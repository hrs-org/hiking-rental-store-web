export interface Item {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  children: Item[];
}

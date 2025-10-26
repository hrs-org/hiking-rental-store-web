export interface Item {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  rates: ItemRate[];
  children: Item[];
}

export interface ItemRate {
  id?: number;
  minDays: number;
  dailyRate: number;
  isActive: boolean;
}

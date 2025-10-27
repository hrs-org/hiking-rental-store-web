export interface Item {
  id?: number | string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  rates: ItemRate[];
  children: Item[];
}

export interface ItemRate {
  id?: number | string;
  minDays: number;
  dailyRate: number;
  isActive: boolean;
}

export interface Item {
  id?: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  rates: ItemRate[];
  children: Item[];
}

export interface ItemRate {
  id?: string;
  minDays: number;
  dailyRate: number;
  isActive: boolean;
}

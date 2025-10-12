export interface Item {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  rates: { id?: number; minDays: number; dailyRate: number; isActive: boolean }[];
  children: Item[];
}

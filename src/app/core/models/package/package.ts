export interface Package {
  id?: number;
  name: string;
  description: string;
  basePrice: number;
  items: { itemId: number; quantity: number }[];
  rates: { id?: number; minDays: number; dailyRate: number; isActive: boolean }[];
}

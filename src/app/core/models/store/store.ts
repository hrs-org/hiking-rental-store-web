export interface StoreViewModel {
  periodStart: Date;
  periodEnd: Date;
  items: StoreItem[];
  packages: StorePackage[];
}

export interface StoreItem {
  itemId: number;
  itemName: string;
  dailyRate: number;
  availableQuantity: number;
  basePrice?: number;
  children: StoreItem[] | null;
}

export interface StorePackage {
  packageId: number;
  packageName: string;
  dailyRate: number;
  availablePackages: number;
  items: StoreItem[];
}

export interface CatalogEntry {
  itemId?: number;
  packageId?: number;
  catalogId: string;
  type: 'item' | 'package';
  name: string;
  dailyRate: number;
  available: number;
  basePrice?: number;

  children?: CatalogEntry[];
  packageItems?: PackageContentEntry[];

  selectedQty?: number;
}

export interface PackageContentEntry {
  itemId: number;
  name: string;
  available: number;
  dailyRate: number;
  items?: CatalogEntry[];
}

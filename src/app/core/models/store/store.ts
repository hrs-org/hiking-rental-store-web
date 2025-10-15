export interface StoreViewModel {
  periodStart: Date;
  periodEnd: Date;
  items: StoreItem[];
  packages: StorePackage[];
}

export interface StoreItem {
  itemId: 0;
  itemName: string;
  dailyRate: 0;
  availableQuantity: 0;
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

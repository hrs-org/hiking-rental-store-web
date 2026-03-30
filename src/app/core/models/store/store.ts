import { RegisterRequest } from '../user/registerUserReq';

export interface StoreViewModel {
  periodStart: Date;
  periodEnd: Date;
  items: StoreItem[];
  packages: StorePackage[];
}

export interface StoreItem {
  itemId: string;
  itemName: string;
  dailyRate: 0;
  availableQuantity: 0;
  children: StoreItem[] | null;
}

export interface StorePackage {
  packageId: string;
  packageName: string;
  dailyRate: number;
  availablePackages: number;
  items: StoreItem[];
}

export interface CatalogEntry {
  itemId?: string;
  packageId?: string;
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
  itemId: string;
  name: string;
  available: number;
  dailyRate: number;
  items?: CatalogEntry[];
}

export interface StoreDto {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
}

export interface RegisterStoreDto extends RegisterRequest {
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
}

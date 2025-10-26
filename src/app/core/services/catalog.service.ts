import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CatalogEntry,
  PackageContentEntry,
  StoreItem,
  StorePackage,
  StoreViewModel,
} from '../models/store/store';
import { ApiResponse } from '../models/api-response';
import { CATALOG_PREFIX } from '../constants/api.constants';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  http = inject(HttpClient);

  getCatalog(startDate: Date, endDate: Date): Observable<CatalogEntry[]> {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return this.http.get<ApiResponse<StoreViewModel>>(CATALOG_PREFIX, { params }).pipe(
      map((response) => {
        const items =
          response.data?.items?.map((i) => this.mapItem(i, response.data?.items || [])) ?? [];
        const packages =
          response.data?.packages?.map((p) => this.mapPackage(p, response.data?.items || [])) ?? [];
        return [...items, ...packages];
      }),
    );
  }

  private mapItem(i: StoreItem, allItems: StoreItem[]): CatalogEntry {
    return {
      itemId: i.itemId,
      catalogId: `item-${i.itemId}`,
      type: 'item',
      name: i.itemName,
      dailyRate: i.dailyRate ?? i.dailyRate ?? 0,
      available: i.availableQuantity ?? i.availableQuantity ?? 0,
      children: i.children?.map((child) => this.mapItem(child, allItems)) ?? [],
    };
  }

  private mapPackage(p: StorePackage, allItems: StoreItem[]): CatalogEntry {
    return {
      packageId: p.packageId,
      catalogId: `package-${p.packageId}`,
      type: 'package',
      name: p.packageName,
      dailyRate: p.dailyRate ?? 0,
      available: p.availablePackages ?? 0,
      packageItems: p.items?.map((pkgItem) => this.mapPackageItem(pkgItem, allItems)) ?? [],
    };
  }

  private mapPackageItem(pi: StoreItem, allItems: StoreItem[]): PackageContentEntry {
    const fullItem = allItems?.find((x) => x.itemId === pi.itemId);

    return {
      itemId: pi.itemId,
      name: pi.itemName ?? fullItem?.itemName ?? 'Unknown Item',
      available: pi.availableQuantity ?? fullItem?.availableQuantity ?? 0,
      dailyRate: pi.dailyRate ?? fullItem?.dailyRate ?? 0,
      items: fullItem?.children?.map((child) => this.mapItem(child, allItems)) ?? [],
    };
  }
}

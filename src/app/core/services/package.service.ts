import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { Package } from '../models/package/package';
import { PACKAGE_PREFIX } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class PackageService {
  http = inject(HttpClient);

  // get package by id
  getPackageById(packageId: number) {
    return this.http.get<ApiResponse<Package>>(`${PACKAGE_PREFIX}/${packageId}`);
  }

  // get all packages
  getAllPackages() {
    return this.http.get<ApiResponse<Package[]>>(`${PACKAGE_PREFIX}`);
  }

  // add package
  addPackage(packages: Package) {
    return this.http.post<ApiResponse<Package>>(`${PACKAGE_PREFIX}`, packages);
  }

  // update package
  updatePackage(packages: Package) {
    return this.http.put<ApiResponse<Package>>(`${PACKAGE_PREFIX}/${packages.id}`, packages);
  }

  // delete package
  deletePackage(packageId: number) {
    return this.http.delete<ApiResponse<null>>(`${PACKAGE_PREFIX}/${packageId}`);
  }
}

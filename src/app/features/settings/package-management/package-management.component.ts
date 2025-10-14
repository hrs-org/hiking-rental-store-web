import { Component, OnInit, inject } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { PackagesComponent } from '../../../shared/components/packages/packages.component';
import { selectPackageList } from '../../../store/packages/packages.selector';
import { Store } from '@ngrx/store';
import { Package } from '../../../core/models/package/package';
import { loadPackages } from '../../../store/packages/packages.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-management',
  imports: [CommonModule, AsyncPipe, PwaHeaderComponent, PackagesComponent],
  templateUrl: './package-management.component.html',
  styleUrl: './package-management.component.scss',
})
export class PackageManagementComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  packageList$ = this.store.select(selectPackageList);
  packageList!: Package[];

  ngOnInit() {
    this.store.dispatch(loadPackages());
  }

  onClickAddPackage() {
    this.router.navigate(['package-management']);
  }
}

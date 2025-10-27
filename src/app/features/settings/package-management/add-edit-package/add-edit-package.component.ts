import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { selectPackageById } from '../../../../store/packages/packages.selector';
import { PwaHeaderComponent } from '../../../../shared/components/pwa-header/pwa-header.component';
import { Package } from '../../../../core/models/package/package';
import { PackageService } from '../../../../core/services/package.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { Item } from '../../../../core/models/item/item';
import { loadItems } from '../../../../state/items/items.actions';
import { selectItemList } from '../../../../state/items/items.selector';
import { MatSelectModule } from '@angular/material/select';

function showBottomSheet(bottomSheet: MatBottomSheet, title: string, description: string) {
  bottomSheet
    .open(InfoBottomSheetComponent, {
      data: { title, description, isConfirm: false, confirmButtonText: 'OK' },
    })
    .afterDismissed()
    .subscribe();
}

@Component({
  selector: 'app-add-edit-package',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PwaHeaderComponent,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTableModule,
    MatLabel,
    MatSelectModule,
  ],
  templateUrl: './add-edit-package.component.html',
  styleUrl: './add-edit-package.component.scss',
})
export class AddEditPackageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly packageService = inject(PackageService);
  private readonly router = inject(Router);
  private readonly bottomSheet = inject(MatBottomSheet);

  packageId = Number(this.route.snapshot.paramMap.get('id'));
  mode = this.packageId ? 'edit' : 'add';
  is_active = false;
  displayedColumnsItems: string[] = ['itemName', 'quantity', 'delete'];
  displayedColumns: string[] = ['minDays', 'dailyRate', 'delete'];

  // get the package and display it
  package$ = this.store.select(selectPackageById(this.packageId));
  package: Package = {
    name: '',
    description: '',
    basePrice: 0,
    items: [],
    rates: [],
  } as Package;

  // get the item list
  itemList$ = this.store.select(selectItemList);
  itemList!: Item[];

  ngOnInit(): void {
    this.store.dispatch(loadItems());
    this.itemList$.subscribe((itemList) => {
      this.itemList = itemList;
    });
    this.package$.subscribe((packages) => {
      if (this.mode === 'edit') {
        this.package = {
          ...packages,
          rates: [...(packages?.rates || [])],
          items: [...(packages?.items || [])],
        } as Package;
        this.is_active = this.package.rates.some((rate) => rate.isActive);
      } else {
        this.package = {
          name: '',
          description: '',
          basePrice: 0,
          items: [],
          rates: [],
        } as Package;
      }
    });
  }

  onSubmit() {
    if (
      !this.package.name ||
      !this.package.description ||
      this.package.items.some((item) => !item.itemId || item.quantity <= 0)
    ) {
      showBottomSheet(
        this.bottomSheet,
        'Invalid Input',
        'Please fill in all required fields with valid values.',
      );
      return;
    }
    if (this.mode === 'edit') {
      if (this.is_active) {
        this.package.rates = this.package.rates.map((rate) => ({ ...rate, isActive: true }));
      } else {
        this.package.rates = this.package.rates.map((rate) => ({ ...rate, isActive: false }));
      }
      this.packageService.updatePackage(this.package).subscribe(() => {
        this.router.navigate(['package-management']);
      });
    } else {
      for (const rate of this.package.rates) {
        delete rate.id;
      }

      this.packageService.addPackage(this.package).subscribe(() => {
        this.router.navigate(['package-management']);
      });
    }
  }

  addItem() {
    this.package = {
      ...this.package,
      items: [...this.package.items, { itemId: 0, itemName: '', quantity: 0 }],
    };
  }

  addRate() {
    this.package = {
      ...this.package,
      rates: [...this.package.rates, { id: 0, minDays: 0, dailyRate: 0, isActive: true }],
    };
  }

  deleteRate(rateId: number) {
    this.package = {
      ...this.package,
      rates: this.package.rates.filter((rate) => rate.id !== rateId),
    };
  }
}

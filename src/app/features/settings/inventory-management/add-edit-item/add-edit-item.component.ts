import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { selectItemById } from '../../../../store/items/items.selector';
import { PwaHeaderComponent } from '../../../../shared/components/pwa-header/pwa-header.component';
import { Item } from '../../../../core/models/item/item';
import { ItemService } from '../../../../core/services/item.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

function showBottomSheet(bottomSheet: MatBottomSheet, title: string, description: string) {
  bottomSheet
    .open(InfoBottomSheetComponent, {
      data: { title, description, isConfirm: false, confirmButtonText: 'OK' },
    })
    .afterDismissed()
    .subscribe();
}

@Component({
  selector: 'app-add-edit-item',
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
  ],
  templateUrl: './add-edit-item.component.html',
  styleUrl: './add-edit-item.component.scss',
})
export class AddEditItemComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly itemService = inject(ItemService);
  private readonly router = inject(Router);
  private readonly bottomSheet = inject(MatBottomSheet);

  itemId = Number(this.route.snapshot.paramMap.get('id'));
  mode = this.itemId ? 'edit' : 'add';
  is_active = false;
  displayedColumns: string[] = ['minDays', 'dailyRate', 'delete'];

  // get the item and display it
  item$ = this.store.select(selectItemById(this.itemId));
  item: Item = {
    name: '',
    quantity: 0,
    price: 0,
    description: '',
    rates: [],
    children: [],
  } as Item;

  ngOnInit(): void {
    this.item$.subscribe((item) => {
      if (this.mode === 'edit') {
        this.item = {
          ...item,
          rates: [...(item?.rates || [])],
          children: [...(item?.children || [])],
        } as Item;
        this.is_active = this.item.rates.some((rate) => rate.isActive);
      } else {
        this.item = {
          name: '',
          quantity: 0,
          price: 0,
          description: '',
          rates: [],
          children: [],
        } as Item;
      }
      console.log(this.item);
    });
  }

  onSubmit() {
    if (
      !this.item.name ||
      !this.item.description ||
      this.item.children.every((child) => !child.name)
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
        this.item.rates = this.item.rates.map((rate) => ({ ...rate, isActive: true }));
      } else {
        this.item.rates = this.item.rates.map((rate) => ({ ...rate, isActive: false }));
      }
      this.itemService.updateItem(this.item).subscribe(() => {
        this.router.navigate(['inventory-management']);
      });
    } else {
      for (const rate of this.item.rates) {
        delete rate.id;
      }
      console.log(this.item);
      this.itemService.addItem(this.item).subscribe(() => {
        this.router.navigate(['inventory-management']);
      });
    }
  }

  addChildItem() {
    this.item = {
      ...this.item,
      children: [...this.item.children, { name: '', quantity: 0, price: 0 } as Item],
    };
  }

  addRate() {
    this.item = {
      ...this.item,
      rates: [...this.item.rates, { id: 0, minDays: 0, dailyRate: 0, isActive: true }],
    };
  }

  deleteRate(rateId: number) {
    this.item = {
      ...this.item,
      rates: this.item.rates.filter((rate) => rate.id !== rateId),
    };
  }
}

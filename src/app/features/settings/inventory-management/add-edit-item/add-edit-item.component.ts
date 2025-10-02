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

  // get the item and display it
  item$ = this.store.select(selectItemById(this.itemId));
  item: Item = { name: '', quantity: 0, price: 0, description: '', children: [] } as Item;

  ngOnInit(): void {
    this.item$.subscribe((item) => {
      if (this.mode === 'edit') {
        this.item = {
          ...item,
          children: [...(item?.children || [])],
        } as Item;
      } else {
        this.item = { name: '', quantity: 0, price: 0, description: '', children: [] } as Item;
      }
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
      this.itemService.updateItem(this.item).subscribe(() => {
        this.router.navigate(['inventory-management']);
      });
    } else {
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
}

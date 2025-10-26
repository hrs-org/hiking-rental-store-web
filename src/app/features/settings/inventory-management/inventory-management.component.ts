import { Component, OnInit, inject } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { ItemsComponent } from '../../../shared/components/items/items.component';
import { selectItemList } from '../../../state/items/items.selector';
import { Store } from '@ngrx/store';
import { Item } from '../../../core/models/item/item';
import { loadItems } from '../../../state/items/items.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-management',
  imports: [PwaHeaderComponent, AsyncPipe, CommonModule, ItemsComponent],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.scss',
})
export class InventoryManagementComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  itemList$ = this.store.select(selectItemList);
  itemList!: Item[];

  ngOnInit(): void {
    this.store.dispatch(loadItems());
    this.itemList$.subscribe((itemList) => {
      this.itemList = itemList;
    });
  }

  onClickAddItem() {
    this.router.navigate(['add-edit-item']);
  }
}

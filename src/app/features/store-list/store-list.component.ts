import { Component, inject, OnInit } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { StoreService } from '../../core/services/store.service';
import { StoreDto } from '../../core/models/store/store';
import { StoreListItemComponent } from './store-list-item/store-list-item.component';

@Component({
  selector: 'app-store-list',
  imports: [StoreListItemComponent],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss',
})
export class StoreListComponent implements OnInit {
  loadingService = inject(LoadingService);
  storeService = inject(StoreService);

  stores: StoreDto[] = [];

  ngOnInit() {
    this.loadingService.show();
    this.storeService.getAllStores().subscribe({
      next: (res) => {
        if (res.data) {
          this.stores = res.data;
        }
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
      },
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCatalog } from '../../state/store/store.selector';
import { loadCatalog } from '../../state/store/store.actions';
import { StoreItemsComponent } from '../../shared/components/store-items/store-items.component';
import { CatalogEntry } from '../../core/models/store/store';
import { MatButton, MatIconButton } from '@angular/material/button';
import { AsyncPipe, Location } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import moment from 'moment';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { selectUser } from '../../state/user/user.selector';

@Component({
  selector: 'app-store',
  providers: [provideNativeDateAdapter()],
  imports: [
    StoreItemsComponent,
    MatButton,
    AsyncPipe,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatIcon,
    MatIconButton,
    MatDividerModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  catalog$ = this.store.select(selectCatalog);
  user$ = this.store.select(selectUser);
  catalog?: CatalogEntry[];

  startDate = new Date();
  endDate = new Date();
  selectedQuantities: Record<string, number> = {};

  showDateFilter = false;
  storeId?: number;

  ngOnInit(): void {
    this.endDate.setDate(this.endDate.getDate() + 5);
    this.storeId = Number(this.route.snapshot.paramMap.get('storeId'));
    localStorage.setItem('selectedStoreId', JSON.stringify(this.storeId));

    this.store.dispatch(
      loadCatalog({ startDate: this.startDate, endDate: this.endDate, storeId: this.storeId || 0 }),
    );
    this.catalog$.subscribe((catalog) => {
      this.catalog = catalog;
    });
  }

  updateQuantity(event: { catalogId: string; qty: number }) {
    this.selectedQuantities = {
      ...this.selectedQuantities,
      [event.catalogId]: event.qty,
    };
  }

  createOrder() {
    const items: CatalogEntry[] = Object.entries(this.selectedQuantities).map(([key, value]) => {
      const catalogItem = (this.catalog?.find((item) => item.catalogId === key) ||
        this.catalog
          ?.flatMap((item) => item.children || [])
          .find((child) => child.catalogId === key)) as CatalogEntry;

      return {
        ...catalogItem,
        selectedQty: value,
      };
    });

    const checkout = {
      startDate: this.startDate,
      endDate: this.endDate,
      items: items,
    };

    localStorage.setItem('checkoutItems', JSON.stringify(checkout));
    this.router.navigate(['/checkout'], {
      state: { checkout: checkout, storeId: this.storeId },
    });
  }

  hideButton(): boolean {
    if (Object.keys(this.selectedQuantities).length === 0) return true;

    let hide = true;

    Object.keys(this.selectedQuantities).forEach((key) => {
      if (this.selectedQuantities[key] > 0) {
        hide = false;
      }
    });

    return hide;
  }

  toggleShowDateFilter() {
    this.showDateFilter = !this.showDateFilter;
  }

  onDateChange() {
    this.store.dispatch(
      loadCatalog({ startDate: this.startDate, endDate: this.endDate, storeId: this.storeId || 0 }),
    );
  }

  formatDate(date: Date): string {
    return moment(date).format('MM/DD/YYYY');
  }

  onBackButton() {
    this.location.back();
  }
}

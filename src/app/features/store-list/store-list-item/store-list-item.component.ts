import { Component, inject, Input } from '@angular/core';
import { StoreDto } from '../../../core/models/store/store';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-store-list-item',
  imports: [MatIcon],
  templateUrl: './store-list-item.component.html',
  styleUrl: './store-list-item.component.scss',
})
export class StoreListItemComponent {
  router = inject(Router);
  @Input() store: StoreDto | null = null;

  onItemClick() {
    if (this.store) {
      this.router.navigate(['/catalog', this.store.id]);
    }
  }
}

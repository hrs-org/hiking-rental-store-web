import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectStore } from '../../../state/store/store.selector';

@Component({
  selector: 'app-store-profile',
  standalone: true,
  imports: [CommonModule, PwaHeaderComponent, MatCardModule, MatButtonModule],
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProfileComponent {
  private store = inject(Store);

  store$ = this.store.select(selectStore);
}

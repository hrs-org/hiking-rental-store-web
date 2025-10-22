import { AfterViewInit, Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { filter, startWith, map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../state/user/user.selector';
import { User } from '../../../core/models/user/user';
@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLinkActive, RouterLink, MatIcon],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private store = inject(Store);
  private subscriptions = new Subscription();

  @Output() titleChange = new EventEmitter<string>();

  user$ = this.store.select(selectUser);
  user?: User;
  title$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(this.router.url),
    map(() => {
      const current = this.router.url;
      if (current.includes('catalog')) return 'Catalog';
      if (current.includes('store')) return 'Store';
      if (current.includes('booking')) return 'Booking';
      if (current.includes('return')) return 'Return';
      if (current.includes('settings')) return 'Settings';
      return 'Dashboard';
    }),
  );

  ngAfterViewInit(): void {
    this.subscriptions.add(this.title$.subscribe((title) => this.titleChange.emit(title)));
    this.subscriptions.add(
      this.user$.subscribe((user) => {
        if (user) this.user = user;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClick() {
    this.title$.subscribe((title) => this.titleChange.emit(title));
  }
}

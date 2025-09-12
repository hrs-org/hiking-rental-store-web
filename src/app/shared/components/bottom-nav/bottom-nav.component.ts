import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { filter, startWith, map } from 'rxjs';
@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLinkActive, RouterLink, MatIcon],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  private router = inject(Router);
  @Output() titleChange = new EventEmitter<string>();

  title$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(this.router.url),
    map(() => {
      const current = this.router.url;
      if (current.includes('store')) return 'Store';
      if (current.includes('booking')) return 'Booking';
      if (current.includes('return')) return 'Return';
      if (current.includes('settings')) return 'Settings';
      return 'Dashboard';
    }),
  );

  constructor() {
    this.title$.subscribe((title) => this.titleChange.emit(title));
  }

  onClick() {
    this.title$.subscribe((title) => this.titleChange.emit(title));
  }
}

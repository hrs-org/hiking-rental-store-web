import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoadingService } from '../../core/services/loading.service';
import { selectUser } from '../../state/user/user.selector';
import { UserRole } from '../../core/models/user/user';
import { selectStore } from '../../state/store/store.selector';

@Component({
  selector: 'app-role-redirect',
  imports: [],
  templateUrl: './role-redirect.component.html',
  styleUrl: './role-redirect.component.scss',
})
export class RoleRedirectComponent implements OnInit {
  private router = inject(Router);
  private store = inject(Store);
  private loadingService = inject(LoadingService);

  user$ = this.store.select(selectUser);
  store$ = this.store.select(selectStore);

  ngOnInit(): void {
    this.loadingService.show();

    this.user$.subscribe((user) => {
      this.loadingService.hide();

      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      if (user.role === UserRole.Customer) {
        this.router.navigate(['/stores']);
      } else {
        this.store$.subscribe((store) => {
          this.router.navigate(['/catalog', store?.id]);
        });
      }
    });
  }
}

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { selectUser } from '../../state/user/user.selector';
import { UserRole } from '../models/user/user';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedRoles = route.data['roles'] as UserRole[];

    return this.store.select(selectUser).pipe(
      take(1),
      map((user) => {
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      }),
    );
  }
}

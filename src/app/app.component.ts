import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Store } from '@ngrx/store';
import { loadUser } from './state/user/user.actions';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { LoadingService } from './core/services/loading.service';
import { AsyncPipe } from '@angular/common';
import { UserService } from './core/services/user.service';
import { take } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  readonly loadingService = inject(LoadingService);
  private store = inject(Store);
  private cd = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    if (environment.auth0?.enabled) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token || !this.authService.isLoggedIn()) return;

    this.userService
      .validateUserExists()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res?.data) {
            this.store.dispatch(loadUser());
          }
          this.cd.detectChanges();
        },
        error: () => {
          this.cd.detectChanges();
        },
      });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Store } from '@ngrx/store';
import { loadUser } from './store/user/user.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private store = inject(Store);

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    if (!token || !this.authService.isLoggedIn()) return;

    if (this.authService.isTokenExpired(token)) {
      this.authService.refreshToken().subscribe();
    } else {
      this.store.dispatch(loadUser());
    }
  }
}

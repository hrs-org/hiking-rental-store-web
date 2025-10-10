import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../core/services/auth.service';

describe('ResetPasswordComponent', () => {
  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { queryParams: { token: 'dummy-token' } },
      queryParams: of({ token: 'dummy-token' }),
    };

    const authMock = {
      resetPassword: () => of({ message: 'ok' }),
    };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ResetPasswordComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});

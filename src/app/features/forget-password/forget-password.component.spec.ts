import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ForgetPasswordComponent } from './forget-password.component';
import { AuthService } from '../../core/services/auth.service';

describe('ForgetPasswordComponent', () => {
  beforeEach(async () => {
    const authMock = {
      forgotPassword: () => of({ message: 'ok' }),
    };

    const activatedRouteMock = {
      snapshot: { queryParams: {} },
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [ForgetPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ForgetPasswordComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});

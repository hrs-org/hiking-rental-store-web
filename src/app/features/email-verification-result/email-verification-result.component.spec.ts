import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationResultComponent } from './email-verification-result.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('EmailVerificationResultComponent', () => {
  let component: EmailVerificationResultComponent;
  let fixture: ComponentFixture<EmailVerificationResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationResultComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PwaLayoutComponent } from './pwa-layout.component';

describe('PwaLayoutComponent', () => {
  let component: PwaLayoutComponent;
  let fixture: ComponentFixture<PwaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaLayoutComponent, NoopAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PwaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

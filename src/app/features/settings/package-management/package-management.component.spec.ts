import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { PackageManagementComponent } from './package-management.component';

describe('PackageManagementComponent', () => {
  let component: PackageManagementComponent;
  let fixture: ComponentFixture<PackageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageManagementComponent],
      providers: [provideStore({}), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeManagementPageComponent } from './employees-management.component';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';

describe('EmployeeManagementPageComponent', () => {
  let component: EmployeeManagementPageComponent;
  let fixture: ComponentFixture<EmployeeManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeManagementPageComponent],
      providers: [provideStore([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

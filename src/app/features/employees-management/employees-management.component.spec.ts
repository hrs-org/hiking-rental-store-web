import { ComponentFixture, TestBed } from '@angular/core/testing';

import { em_managementPageComponent } from './employees-management.component';

describe('EmployeesManagementComponent', () => {
  let component: em_managementPageComponent;
  let fixture: ComponentFixture<em_managementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [em_managementPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(em_managementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

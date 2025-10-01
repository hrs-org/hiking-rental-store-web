import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeesComponent } from './add-edit-employees.component';

describe('AddEditEmployeesComponent', () => {
  let component: AddEditEmployeesComponent;
  let fixture: ComponentFixture<AddEditEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEmployeesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

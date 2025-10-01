import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddEditEmployeesComponent } from './add-edit-employees.component';
import { provideHttpClient } from '@angular/common/http';

describe('AddEditEmployeesComponent', () => {
  let component: AddEditEmployeesComponent;
  let fixture: ComponentFixture<AddEditEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEmployeesComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

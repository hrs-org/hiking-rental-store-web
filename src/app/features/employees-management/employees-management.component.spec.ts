import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  em_managementPageComponent,
  Employee,
  DialogResult,
} from './employees-management.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

describe('em_managementPageComponent', () => {
  let component: em_managementPageComponent;
  let fixture: ComponentFixture<em_managementPageComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockBottomSheet: jasmine.SpyObj<MatBottomSheet>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockUserService = jasmine.createSpyObj('UserService', [
      'loadEmployees',
      'loadManagers',
      'CreateEmployee',
      'UpdateEmployee',
      'DeleteEmployee',
    ]);
    mockBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatBottomSheetModule, StoreModule.forRoot({})],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatBottomSheet, useValue: mockBottomSheet },
        { provide: UserService, useValue: mockUserService },
      ],
      declarations: [em_managementPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(em_managementPageComponent);
    component = fixture.componentInstance;

    // Mock store selectUser
    component['store'].select = jasmine.createSpy().and.returnValue(of({ role: 'Admin' }));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees and managers for Admin', () => {
    const managers: Employee[] = [
      { id: 1, firstName: 'M', lastName: 'One', email: 'm1@test.com', role: 'Manager' },
    ];
    const employees: Employee[] = [
      { id: 2, firstName: 'E', lastName: 'Two', email: 'e2@test.com', role: 'Employee' },
    ];

    mockUserService.loadEmployees.and.returnValue(
      of({ data: managers, success: true, message: '' }),
    );
    mockUserService.loadEmployees.and.returnValue(
      of({ data: employees, success: true, message: '' }),
    );

    component.loadEmployeesandManager();

    expect(mockUserService.loadEmployees).toHaveBeenCalled();
  });

  it('should open create dialog and add new employee', () => {
    const newEmployee: Employee = {
      id: 3,
      firstName: 'New',
      lastName: 'Employee',
      email: 'new@test.com',
      role: 'Employee',
    };

    const mockDialogRef: Partial<MatDialogRef<Employee>> = {
      afterClosed: () => of(newEmployee),
    };
    mockDialog.open.and.returnValue(mockDialogRef as MatDialogRef<Employee>);

    component.onCreateEmployee();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.employees[0]).toEqual(newEmployee);
  });

  it('should open edit dialog and update employee', () => {
    const emp: Employee = {
      id: 4,
      firstName: 'Edit',
      lastName: 'Emp',
      email: 'edit@test.com',
      role: 'Employee',
    };
    component.employees = [emp];

    const updated: Employee = { ...emp, firstName: 'Updated' };
    const mockDialogRef: Partial<MatDialogRef<DialogResult>> = {
      afterClosed: () => of({ action: 'update', employee: emp, feedback: updated }),
    };
    mockDialog.open.and.returnValue(mockDialogRef as MatDialogRef<DialogResult>);

    component.onEmployeeClick(emp);

    expect(component.employees[0].firstName).toBe('Updated');
  });

  it('should delete employee after confirmation', fakeAsync(() => {
    const emp: Employee = {
      id: 5,
      firstName: 'Del',
      lastName: 'Emp',
      email: 'del@test.com',
      role: 'Employee',
    };
    component.employees = [emp];

    // Mock bottom sheet confirmation
    const mockBottomSheetRef: Partial<MatBottomSheetRef<InfoBottomSheetComponent, boolean>> = {
      afterDismissed: () => of(true),
    };
    mockBottomSheet.open.and.returnValue(
      mockBottomSheetRef as MatBottomSheetRef<InfoBottomSheetComponent, boolean>,
    );

    // Mock DeleteEmployee API to return ApiResponse<null>
    mockUserService.DeleteEmployee.and.returnValue(
      of({ success: true, message: 'Deleted successfully', data: null }),
    );

    // Mock edit dialog open to return delete action
    const mockDialogRef: Partial<MatDialogRef<DialogResult>> = {
      afterClosed: () => of({ action: 'delete', employee: emp }),
    };
    mockDialog.open.and.returnValue(mockDialogRef as MatDialogRef<DialogResult>);

    component.onEmployeeClick(emp);
    tick();

    expect(mockUserService.DeleteEmployee).toHaveBeenCalledWith(emp.id);
    expect(component.employees.find((e) => e.id === emp.id)).toBeUndefined();
  }));

  it('should handle create employee error and show bottom sheet', fakeAsync(() => {
    const errorResponse = { error: { errors: ['Email already exists'] } };
    mockUserService.CreateEmployee.and.returnValue(
      of().pipe(() => {
        throw errorResponse;
      }),
    );

    const mockDialogRef: Partial<MatDialogRef<Employee>> = { afterClosed: () => of() };
    mockDialog.open.and.returnValue(mockDialogRef as MatDialogRef<Employee>);

    spyOn(mockBottomSheet, 'open');

    component.onCreateEmployee();
    tick();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockBottomSheet.open).toHaveBeenCalled();
  }));
});

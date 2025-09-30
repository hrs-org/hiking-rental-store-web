import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { PwaHeaderComponent } from '../../shared/components/pwa-header/pwa-header.component';
import { EmployeeCreateDialogComponent } from './employee-create-dialog.component';
import { EmployeeEditDialogComponent } from './employee-edit-dialog.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selector';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
export type CreateEmployeeDto = Omit<Employee, 'id'>;
export interface CreateDialogData extends Employee {
  userRole: string;
}
export type DialogResult =
  | { action: 'update'; employee: Employee; feedback: Employee }
  | { action: 'delete'; employee: Employee };

@Component({
  selector: 'app-em-management-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, PwaHeaderComponent],
  templateUrl: './employees-management.component.html',
  styleUrls: ['./employees-management.component.scss'],
})
export class em_managementPageComponent implements OnInit {
  private store = inject(Store);
  private bottomSheet = inject(MatBottomSheet);

  user$ = this.store.select(selectUser);
  employees: Employee[] = [];
  loading = true;
  errorMessage = '';
  title = 'Employee Management';

  userRole = 'user';

  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.userRole = user.role;
      }
    });
    this.loadEmployeesandManager();
  }

  loadError() {
    this.bottomSheet.open(InfoBottomSheetComponent, {
      data: {
        title: 'Error',
        description: 'Unable to load data. Please try again later.',
        isConfirm: false,
        confirmButtonText: 'OK',
      },
    });
  }
  loadEmployeesandManager() {
    if (this.userRole == 'Admin') {
      this.userService.loadManagers().subscribe({
        next: (response) => {
          this.employees = response.data || [];
          this.userService.loadEmployees().subscribe({
            next: (response) => {
              this.employees = [...this.employees, ...(response.data || [])];
              this.loading = false;
            },
            error: () => {
              this.loadError();
            },
          });
        },
        error: () => {
          this.loadError();
        },
      });
    }
    if (this.userRole == 'Manager') {
      this.userService.loadEmployees().subscribe({
        next: (response) => {
          this.employees = response.data || [];
          this.loading = false;
        },
        error: () => {
          this.loadError();
        },
      });
    }
  }
  onCreateEmployee() {
    const dialogRef = this.dialog.open(EmployeeCreateDialogComponent, {
      width: '400px',
      data: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        userRole: this.userRole,
      } as CreateDialogData,
    });
    dialogRef.afterClosed().subscribe((newEmployee: Employee | undefined) => {
      if (!newEmployee) return;
      this.employees.unshift(newEmployee);
      this.errorMessage = '';
    });
  }

  onEmployeeClick(emp: Employee) {
    const dialogRef = this.dialog.open(EmployeeEditDialogComponent, {
      width: '400px',
      data: { ...emp, userRole: this.userRole },
    });

    dialogRef.afterClosed().subscribe((result: DialogResult | undefined) => {
      if (!result) return;

      if (result.action === 'update') {
        const updated = result.feedback;
        const index = this.employees.findIndex((e) => e.id === updated.id);
        if (index > -1) this.employees[index] = result.feedback;
      } else if (result.action === 'delete') {
        const deleted = result.employee;
        this.employees = this.employees.filter((e) => e.id !== deleted.id);
      }
    });
  }
}

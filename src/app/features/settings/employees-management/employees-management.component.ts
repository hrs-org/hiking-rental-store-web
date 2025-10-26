import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddEditEmployeesComponent } from './add-edit-employees/add-edit-employees.component';
import { UserService } from '../../../core/services/user.service';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { selectUser } from '../../../state/user/user.selector';
import { Employee } from '../../../core/models/user/employee';

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
export class EmployeeManagementPageComponent implements OnInit {
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
        this.loadEmployeesandManager();
      }
    });
  }

  loadEmployeesandManager() {
    this.userService.loadEmployees().subscribe({
      next: (response) => {
        this.employees = response.data || [];
        this.loading = false;
      },
    });
  }
  onCreateEmployee() {
    const dialogRef = this.dialog.open(AddEditEmployeesComponent, {
      width: '400px',
      data: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        userRole: this.userRole,
        function: 'Add',
      },
    });
    dialogRef.afterClosed().subscribe((newEmployee: Employee | undefined) => {
      if (!newEmployee) return;
      this.employees.unshift(newEmployee);
      this.errorMessage = '';
    });
  }

  onEmployeeClick(emp: Employee) {
    const dialogRef = this.dialog.open(AddEditEmployeesComponent, {
      width: '400px',
      data: { ...emp, userRole: this.userRole, function: 'Edit' },
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

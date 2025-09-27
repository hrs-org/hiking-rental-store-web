import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeEditDialogComponent } from './employee-edit-dialog.component';
import { EmployeeCreateDialogComponent } from './employee-create-dialog.component';
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
export type DialogResult =
  | { action: 'update'; employee: Employee; feedback: Employee }
  | { action: 'delete'; employee: Employee };

@Component({
  selector: 'app-em-management-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './employees-management.component.html',
  styleUrls: ['./employees-management.component.scss'],
})
export class em_managementPageComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  errorMessage = '';

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.http.get<Employee[]>('https://localhost:5001/api/users/employees').subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorMessage = '';
          this.loading = false;
        } else {
          console.error('Failed to load employees', err);
          this.errorMessage = err.status
            ? `Unable to load employees. (Error ${err.status})`
            : 'Unable to load employees. (Unknown error)';
          this.loading = false;
        }
      },
    });
  }
  onCreateEmployee() {
    const dialogRef = this.dialog.open(EmployeeCreateDialogComponent, {
      width: '400px',
      data: { firstName: '', lastName: '', email: '', role: '' } as Employee,
    });

    dialogRef.afterClosed().subscribe((newEmployee: Employee | undefined) => {
      if (!newEmployee) return;
      this.employees.push(newEmployee);
      this.errorMessage = '';
    });
  }

  onEmployeeClick(emp: Employee) {
    const dialogRef = this.dialog.open(EmployeeEditDialogComponent, {
      width: '400px',
      data: { ...emp },
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

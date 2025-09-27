import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from './employees-management.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-create-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Create Employee</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>First Name</mat-label>
        <input matInput [(ngModel)]="data.firstName" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Last Name</mat-label>
        <input matInput [(ngModel)]="data.lastName" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="data.email" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Role</mat-label>
        <input matInput [(ngModel)]="data.role" />
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onCreate()">Create</button>
    </div>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 12px;
      }
    `,
  ],
})
export class EmployeeCreateDialogComponent {
  public dialogRef = inject(MatDialogRef<EmployeeCreateDialogComponent>);
  public data: Employee = inject(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close();
  }
  private http = inject(HttpClient);
  onCreate(): void {
    if (!this.data) return;
    this.http
      .post<Employee>('https://localhost:5001/api/users/employees/add', this.data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (saved) => {
          this.dialogRef.close(saved);
        },
        error: (err) => {
          console.error('Failed to create employee', err);
          alert(err.error?.errors[0] || 'Failed to create employee, please try again.');
        },
      });
  }
}

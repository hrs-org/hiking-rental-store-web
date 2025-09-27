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
  selector: 'app-employee-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Edit Employee</h2>
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
    <div class="dialog-actions">
      <div class="left">
        <button mat-button color="warn" (click)="onDelete()">Delete</button>
      </div>
      <div class="right">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-button color="primary" (click)="onSave()">Save</button>
      </div>
    </div>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 12px;
      }

      .dialog-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }

      .left {
        display: flex;
        align-items: center;
      }

      .right {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class EmployeeEditDialogComponent {
  public dialogRef = inject(MatDialogRef<EmployeeEditDialogComponent>);
  public data = inject<Employee>(MAT_DIALOG_DATA);
  private http = inject(HttpClient);

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updated = this.data;
    this.http
      .put<Employee>('https://localhost:5001/api/users/employees', updated, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (saved) => {
          this.dialogRef.close({ action: 'update', employee: this.data, feedback: saved });
        },
        error: (err) => {
          console.error('Failed to update employee', err);
          alert(err.error?.errors[0] || 'Failed to update employee, please try again.');
        },
      });
  }

  onDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.data.firstName} ${this.data.lastName}?`)) {
      this.http
        .delete(`https://localhost:5001/api/users/employees/${this.data.id}`, {
          headers: { accept: '*/*' },
        })
        .subscribe({
          next: () => {
            this.dialogRef.close({ action: 'delete', employee: this.data });
          },
          error: (err) => {
            console.error('Failed to delete employee', err);
            alert(err.error?.errors[0] || 'Failed to delete employee, please try again.');
          },
        });
    }
  }
}

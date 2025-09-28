import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from './employees-management.component';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../core/services/user.service';

interface CreateDialogData extends Employee {
  userRole: string; // Added to determine the role of the user creating the employee
}
@Component({
  selector: 'app-employee-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
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

      <ng-container [ngSwitch]="userRole">
        <mat-form-field appearance="fill" class="full-width" *ngSwitchCase="'Admin'">
          <mat-label>Role</mat-label>
          <mat-select [(ngModel)]="data.role">
            <mat-option value="Manager">Manager</mat-option>
            <mat-option value="Employee">Employee</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width" *ngSwitchCase="'Manager'">
          <mat-label>Role</mat-label>
          <input matInput [(ngModel)]="data.role" disabled />
        </mat-form-field>
      </ng-container>
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
export class EmployeeCreateDialogComponent implements OnInit {
  private userService = inject(UserService);

  public dialogRef = inject(MatDialogRef<EmployeeCreateDialogComponent>);
  public data: CreateDialogData = inject(MAT_DIALOG_DATA);
  // public data: Employee = inject(MAT_DIALOG_DATA);

  get userRole() {
    return this.data.userRole;
  }
  private http = inject(HttpClient);
  ngOnInit(): void {
    if (this.data.userRole === 'Manager') {
      this.data.role = 'Employee';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (!this.data) return;
    this.userService.CreateEmployee(this.data).subscribe({
      next: (saved) => {
        this.dialogRef.close(saved);
      },
      error: (err) => {
        console.error('Failed to create employee', err);
        alert(err.error?.errors?.[0] || 'Failed to create employee, please try again.');
      },
    });
  }
}

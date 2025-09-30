import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from './employees-management.component';
import { UserService } from '../../core/services/user.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

interface CreateDialogData extends Employee {
  userRole: string; // Added to determine the role of the user creating the employee
}
@Component({
  selector: 'app-employee-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Create Employee</h2>
    <form [formGroup]="registerForm">
      <div mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>

        <ng-container [ngSwitch]="userRole">
          <mat-form-field appearance="fill" class="full-width" *ngSwitchCase="'Admin'">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option value="Manager">Manager</mat-option>
              <mat-option value="Employee">Employee</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width" *ngSwitchCase="'Manager'">
            <mat-label>Role</mat-label>
            <input matInput formControlName="role" />
          </mat-form-field>
        </ng-container>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-button color="primary" (click)="onCreate()" [disabled]="registerForm.invalid">
          Create
        </button>
      </div>
    </form>
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
  private bottomSheet = inject(MatBottomSheet);
  public dialogRef = inject(MatDialogRef<EmployeeCreateDialogComponent>);
  public data: CreateDialogData = inject(MAT_DIALOG_DATA);
  // public data: Employee = inject(MAT_DIALOG_DATA);

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', Validators.required),
  });

  get userRole() {
    return this.data.userRole;
  }
  ngOnInit(): void {
    if (this.data.userRole === 'Manager') {
      this.registerForm.patchValue({ role: 'Employee' });
      this.registerForm.get('role')?.disable();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      this.registerForm.markAsDirty();
      this.registerForm.markAsTouched();
      return;
    }
    const payload = this.registerForm.getRawValue() as Employee;
    console.log(payload);
    this.userService.CreateEmployee(payload).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (err) => {
        this.bottomSheet.open(InfoBottomSheetComponent, {
          data: {
            title: 'Error',
            description: err.error?.errors?.[0],
            isConfirm: false,
            confirmButtonText: 'OK',
          },
        });
        console.error('Failed to create employee', err.error.errors);
        // alert(err.error?.errors?.[0] || 'Failed to create employee, please try again.');
      },
    });
  }
}

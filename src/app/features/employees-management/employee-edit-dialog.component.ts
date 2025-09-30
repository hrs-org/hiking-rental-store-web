import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from './employees-management.component';
import { UserService } from '../../core/services/user.service';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

interface EditDialogData extends Employee {
  userRole: string;
}
@Component({
  selector: 'app-employee-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit Employee</h2>
    <form [formGroup]="UpdateForm">
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
      <div class="dialog-actions">
        <div class="left">
          <button mat-button color="warn" (click)="onDelete()">Delete</button>
        </div>
        <div class="right">
          <button mat-button (click)="onCancel()">Cancel</button>
          <button mat-button color="primary" (click)="onSave()" [disabled]="UpdateForm.invalid">
            Save
          </button>
        </div>
      </div>
    </form>
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
export class EmployeeEditDialogComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<EmployeeEditDialogComponent>);
  public data: EditDialogData = inject(MAT_DIALOG_DATA);
  private userService = inject(UserService);
  private bottomSheet = inject(MatBottomSheet);
  UpdateForm = new FormGroup({
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
      this.UpdateForm.patchValue({ role: 'Employee' });
      this.UpdateForm.get('role')?.disable();
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.UpdateForm.invalid) {
      this.UpdateForm.markAsDirty();
      this.UpdateForm.markAsTouched();
      return;
    }
    const updated = this.UpdateForm.getRawValue() as Employee;
    this.userService.UpdateEmployee(updated).subscribe({
      next: (response) => {
        this.dialogRef.close({ action: 'update', employee: this.data, feedback: response.data });
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
        console.error('Failed to update employee', err);
        // alert(err.error?.errors[0] || 'Failed to update employee, please try again.');
      },
    });
  }

  onDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.data.firstName} ${this.data.lastName}?`)) {
      this.userService.DeleteEmployee(this.data.id).subscribe({
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

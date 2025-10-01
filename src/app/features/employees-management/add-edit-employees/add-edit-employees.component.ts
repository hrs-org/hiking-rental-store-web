import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../employees-management.component';
import { UserService } from '../../../core/services/user.service';
import { InfoBottomSheetComponent } from '../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

interface EditDialogData extends Employee {
  userRole: string;
  fuction: 'Edit' | 'Add';
}
@Component({
  selector: 'app-add-edit-employees',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './add-edit-employees.component.html',
  styleUrl: './add-edit-employees.component.scss',
})
export class AddEditEmployeesComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<AddEditEmployeesComponent>);
  public data: EditDialogData = inject(MAT_DIALOG_DATA);
  private userService = inject(UserService);
  private bottomSheet = inject(MatBottomSheet);
  public title = 'Edit Employee';
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
    this.UpdateForm.patchValue(this.data);
    if (this.data.userRole === 'Manager') {
      this.UpdateForm.patchValue({ role: 'Employee' });
      this.UpdateForm.get('role')?.disable();
    }
    this.title = this.data.fuction === 'Edit' ? 'Edit Employee' : 'Create Employee';
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.data.fuction === 'Edit') {
      if (this.UpdateForm.invalid) {
        this.UpdateForm.markAsDirty();
        this.UpdateForm.markAsTouched();
        return;
      }
      const updated = this.UpdateForm.getRawValue() as Employee;
      updated.id = this.data.id;
      this.userService.UpdateEmployee(updated).subscribe({
        next: (response) => {
          this.dialogRef.close({ action: 'update', employee: this.data, feedback: response.data });
        },
      });
    }
  }

  onDelete(): void {
    if (this.data.fuction === 'Edit') {
      this.bottomSheet
        .open(InfoBottomSheetComponent, {
          data: {
            title: 'Confirm Delete',
            description: `Are you sure you want to delete ${this.data.firstName} ${this.data.lastName} ID: ${this.data.id} ? `,
            isConfirm: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          },
        })
        .afterDismissed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.userService.DeleteEmployee(this.data.id).subscribe({
              next: () => {
                this.dialogRef.close({ action: 'delete', employee: this.data });
              },
            });
          }
        });
    }
  }
  onCreate(): void {
    // console.log(this.CreateForm.value);
    if (this.UpdateForm.invalid) {
      this.UpdateForm.markAsDirty();
      this.UpdateForm.markAsTouched();
      return;
    }
    const payload = this.UpdateForm.getRawValue() as Employee;
    // console.log(payload);
    this.userService.CreateEmployee(payload).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
    });
  }
}

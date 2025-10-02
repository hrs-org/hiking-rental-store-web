import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-info-bottomsheet',
  imports: [MatBottomSheetModule, MatButton, NgStyle],
  templateUrl: './info-bottom-sheet.component.html',
  styleUrl: './info-bottom-sheet.component.scss',
})
export class InfoBottomSheetComponent {
  private bottomSheetRef = inject(MatBottomSheetRef<InfoBottomSheetComponent>);
  public data = inject(MAT_BOTTOM_SHEET_DATA) as {
    title: string;
    description: string;
    isConfirm: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
  };
  constructor() {
    if (!this.data.confirmButtonText) {
      this.data.confirmButtonText = 'Ok';
    }

    if (this.data.isConfirm && !this.data.cancelButtonText) {
      this.data.cancelButtonText = 'Cancel';
    }
  }

  dismiss(confirm: boolean) {
    this.bottomSheetRef.dismiss(confirm);
  }
}

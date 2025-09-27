import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBottomSheetComponent } from './info-bottom-sheet.component';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

describe('InfoBottomSheetComponent', () => {
  let component: InfoBottomSheetComponent;
  let fixture: ComponentFixture<InfoBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBottomSheetComponent],
      providers: [
        {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: {
            title: 'Test',
            description: 'Test',
            isConfirm: false,
            confirmButtonText: 'OK',
          },
        },
        { provide: MatBottomSheetRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

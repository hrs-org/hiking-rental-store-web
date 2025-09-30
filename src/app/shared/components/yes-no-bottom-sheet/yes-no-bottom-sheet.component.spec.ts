import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoBottomSheetComponent } from './yes-no-bottom-sheet.component';

describe('YesNoBottomSheetComponent', () => {
  let component: YesNoBottomSheetComponent;
  let fixture: ComponentFixture<YesNoBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YesNoBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YesNoBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

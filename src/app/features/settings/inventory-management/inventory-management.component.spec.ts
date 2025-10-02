import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementComponent } from './inventory-management.component';
import { provideStore } from '@ngrx/store';

describe('InventoryManagementComponent', () => {
  let component: InventoryManagementComponent;
  let fixture: ComponentFixture<InventoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryManagementComponent],
      providers: [provideStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

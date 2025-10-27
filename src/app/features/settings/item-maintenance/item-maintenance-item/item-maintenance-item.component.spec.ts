import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenanceItemComponent } from './item-maintenance-item.component';

describe('ItemMaintenanceItemComponent', () => {
  let component: ItemMaintenanceItemComponent;
  let fixture: ComponentFixture<ItemMaintenanceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMaintenanceItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMaintenanceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

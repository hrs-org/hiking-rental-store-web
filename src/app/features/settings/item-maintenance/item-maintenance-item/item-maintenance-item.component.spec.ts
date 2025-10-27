import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ItemMaintenanceItemComponent } from './item-maintenance-item.component';
import { ItemMaintenanceService } from '../../../../core/services/item-maintenance.service';
import { ItemMaintenance } from '../../../../core/models/item-maintenance/item-maintenance';

describe('ItemMaintenanceItemComponent', () => {
  let component: ItemMaintenanceItemComponent;
  let fixture: ComponentFixture<ItemMaintenanceItemComponent>;

  const itemMaintenanceServiceStub = {
    getItemMaintenances: () => of({ success: true, message: '', data: [] as ItemMaintenance[] }),
    fixItemMaintenance: () => of({ success: true, message: '', data: null }),
  } as unknown as Partial<ItemMaintenanceService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMaintenanceItemComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: ItemMaintenanceService, useValue: itemMaintenanceServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMaintenanceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

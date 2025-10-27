import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { ItemMaintenanceComponent } from './item-maintenance.component';
import { ItemMaintenanceService } from '../../../core/services/item-maintenance.service';
import { ItemMaintenance } from '../../../core/models/item-maintenance/item-maintenance';

describe('ItemMaintenanceComponent', () => {
  let component: ItemMaintenanceComponent;
  let fixture: ComponentFixture<ItemMaintenanceComponent>;

  beforeEach(async () => {
    const itemMaintenanceServiceStub: Partial<ItemMaintenanceService> = {
      getItemMaintenances: () => of({ success: true, message: '', data: [] as ItemMaintenance[] }),
      fixItemMaintenance: () => of({ success: true, message: '', data: null }),
    };

    await TestBed.configureTestingModule({
      imports: [ItemMaintenanceComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: ItemMaintenanceService, useValue: itemMaintenanceServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

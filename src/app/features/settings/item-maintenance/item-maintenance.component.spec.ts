import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ItemMaintenanceComponent } from './item-maintenance.component';

describe('ItemMaintenanceComponent', () => {
  let component: ItemMaintenanceComponent;
  let fixture: ComponentFixture<ItemMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMaintenanceComponent, HttpClientTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            store: {
              id: 'store-1',
              name: 'Test Store',
            },
          },
        }),
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

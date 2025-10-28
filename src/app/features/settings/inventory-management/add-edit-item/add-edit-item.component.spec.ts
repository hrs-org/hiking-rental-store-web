import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditItemComponent } from './add-edit-item.component';
import { provideStore, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ItemService } from '../../../../core/services/item.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { Item, ItemRate } from '../../../../core/models/item/item';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AddEditItemComponent', () => {
  let component: AddEditItemComponent;
  let fixture: ComponentFixture<AddEditItemComponent>;
  let itemService: jasmine.SpyObj<ItemService>;
  let bottomSheet: jasmine.SpyObj<MatBottomSheet>;
  let location: jasmine.SpyObj<Location>;
  let store: jasmine.SpyObj<Store>;
  let activatedRoute: ActivatedRoute;

  const mockItem: Item = {
    id: 1,
    name: 'Test Item',
    description: 'Test Description',
    quantity: 10,
    price: 100,
    rates: [
      { id: 1, minDays: 1, dailyRate: 50, isActive: true },
      { id: 2, minDays: 7, dailyRate: 40, isActive: true },
    ],
    children: [
      {
        id: 10,
        name: 'Child Item',
        description: 'Child Description',
        quantity: 5,
        price: 25,
        rates: [],
        children: [],
      },
    ],
  };

  beforeEach(async () => {
    const itemServiceSpy = jasmine.createSpyObj('ItemService', ['addItem', 'updateItem']);
    const bottomSheetSpy = jasmine.createSpyObj('MatBottomSheet', ['open']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const storeSpy = jasmine.createSpyObj('Store', ['select']);

    // Set default return value for store.select
    storeSpy.select.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [AddEditItemComponent],
      providers: [
        provideStore({}),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: ItemService, useValue: itemServiceSpy },
        { provide: MatBottomSheet, useValue: bottomSheetSpy },
        { provide: Location, useValue: locationSpy },
        { provide: Store, useValue: storeSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy('get').and.returnValue(null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    itemService = TestBed.inject(ItemService) as jasmine.SpyObj<ItemService>;
    bottomSheet = TestBed.inject(MatBottomSheet) as jasmine.SpyObj<MatBottomSheet>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    // Reset the store spy before each test
    store.select.calls.reset();
    store.select.and.returnValue(of(null));

    fixture = TestBed.createComponent(AddEditItemComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize in "add" mode when no itemId is provided', () => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);
      fixture.detectChanges();

      expect(component.mode).toBe('add');
      expect(component.itemId).toBeFalsy();
      expect(component.item.name).toBe('');
      expect(component.item.rates).toEqual([]);
      expect(component.item.children).toEqual([]);
    });

    it('should initialize in "edit" mode when itemId is provided', () => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue('1');
      store.select.and.returnValue(of(mockItem));

      const newFixture = TestBed.createComponent(AddEditItemComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.mode).toBe('edit');
      expect(newComponent.itemId).toBe(1);
      expect(newComponent.item.name).toBe('Test Item');
      expect(newComponent.item.rates.length).toBe(2);
      expect(newComponent.item.children.length).toBe(1);
      expect(newComponent.is_active).toBe(true);
    });

    it('should set is_active to true if any rate is active in edit mode', () => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue('1');
      store.select.and.returnValue(of(mockItem));

      const newFixture = TestBed.createComponent(AddEditItemComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.is_active).toBe(true);
    });

    it('should initialize displayedColumns correctly', () => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);
      fixture.detectChanges();

      expect(component.displayedColumns).toEqual(['minDays', 'dailyRate', 'delete']);
    });
  });

  describe('onSubmit - Add Mode', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);
      fixture.detectChanges();
      component.mode = 'add';
    });

    it('should show error bottom sheet when name is empty', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bottomSheet.open.and.returnValue({ afterDismissed: () => of(null) } as any);
      component.item = {
        name: '',
        description: 'Test',
        quantity: 10,
        price: 100,
        rates: [],
        children: [],
      };

      component.onSubmit();

      expect(bottomSheet.open).toHaveBeenCalled();
      expect(itemService.addItem).not.toHaveBeenCalled();
    });

    it('should show error bottom sheet when description is empty', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bottomSheet.open.and.returnValue({ afterDismissed: () => of(null) } as any);
      component.item = {
        name: 'Test Item',
        description: '',
        quantity: 10,
        price: 100,
        rates: [],
        children: [],
      };

      component.onSubmit();

      expect(bottomSheet.open).toHaveBeenCalled();
      expect(itemService.addItem).not.toHaveBeenCalled();
    });

    it('should show error bottom sheet when child item name is empty', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bottomSheet.open.and.returnValue({ afterDismissed: () => of(null) } as any);
      component.item = {
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        price: 100,
        rates: [],
        children: [
          {
            id: 'temp-1',
            name: '',
            description: '',
            quantity: 5,
            price: 25,
            rates: [],
            children: [],
          },
        ],
      };

      component.onSubmit();

      expect(bottomSheet.open).toHaveBeenCalled();
      expect(itemService.addItem).not.toHaveBeenCalled();
    });

    it('should remove all IDs when adding a new item', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemService.addItem.and.returnValue(of({} as any));
      component.item = {
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        price: 100,
        rates: [{ id: 'temp-1', minDays: 1, dailyRate: 50, isActive: true }],
        children: [
          {
            id: 'temp-2',
            name: 'Child',
            description: 'Child Desc',
            quantity: 5,
            price: 25,
            rates: [],
            children: [],
          },
        ],
      };

      component.onSubmit();

      expect(itemService.addItem).toHaveBeenCalled();
      const submittedItem = itemService.addItem.calls.mostRecent().args[0];
      expect(submittedItem.rates[0].id).toBeUndefined();
      expect(submittedItem.children[0].id).toBeUndefined();
      expect(location.back).toHaveBeenCalled();
    });

    it('should successfully add item with valid data', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemService.addItem.and.returnValue(of({} as any));
      component.item = {
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        price: 100,
        rates: [],
        children: [],
      };

      component.onSubmit();

      expect(itemService.addItem).toHaveBeenCalledWith(component.item);
      expect(location.back).toHaveBeenCalled();
    });
  });

  describe('onSubmit - Edit Mode', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue('1');
      store.select.and.returnValue(of(mockItem));
      fixture.detectChanges();
      component.mode = 'edit';
    });

    it('should show error bottom sheet when validation fails', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bottomSheet.open.and.returnValue({ afterDismissed: () => of(null) } as any);
      component.item.name = '';

      component.onSubmit();

      expect(bottomSheet.open).toHaveBeenCalled();
      expect(itemService.updateItem).not.toHaveBeenCalled();
    });

    it('should set all rates to active when is_active is true', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemService.updateItem.and.returnValue(of({} as any));
      component.is_active = true;
      component.item = {
        ...component.item,
        name: 'Test Item',
        description: 'Test Description',
        rates: [
          { id: 1, minDays: 1, dailyRate: 50, isActive: false },
          { id: 2, minDays: 7, dailyRate: 40, isActive: false },
        ],
      };

      component.onSubmit();

      const submittedItem = itemService.updateItem.calls.mostRecent().args[0];
      expect(submittedItem.rates.every((rate: ItemRate) => rate.isActive)).toBe(true);
    });

    it('should set all rates to inactive when is_active is false', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemService.updateItem.and.returnValue(of({} as any));
      component.is_active = false;
      component.item = {
        ...component.item,
        name: 'Test Item',
        description: 'Test Description',
        rates: [
          { id: 1, minDays: 1, dailyRate: 50, isActive: true },
          { id: 2, minDays: 7, dailyRate: 40, isActive: true },
        ],
      };

      component.onSubmit();

      const submittedItem = itemService.updateItem.calls.mostRecent().args[0];
      expect(submittedItem.rates.every((rate: ItemRate) => !rate.isActive)).toBe(true);
    });

    it('should remove temporary IDs from rates before submitting', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemService.updateItem.and.returnValue(of({} as any));
      component.item = {
        ...component.item,
        name: 'Test Item',
        description: 'Test Description',
        rates: [
          { id: 1, minDays: 1, dailyRate: 50, isActive: true },
          { id: 'temp-123', minDays: 7, dailyRate: 40, isActive: true },
        ],
      };

      component.onSubmit();

      const submittedItem = itemService.updateItem.calls.mostRecent().args[0];
      expect(submittedItem.rates[0].id).toBe(1);
      expect(submittedItem.rates[1].id).toBeUndefined();
    });

    it('should remove temporary IDs from children before submitting', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemService.updateItem.and.returnValue(of({} as any));
      component.item = {
        ...component.item,
        name: 'Test Item',
        description: 'Test Description',
        children: [
          {
            id: 10,
            name: 'Child 1',
            description: 'Desc 1',
            quantity: 5,
            price: 25,
            rates: [],
            children: [],
          },
          {
            id: 'temp-456',
            name: 'Child 2',
            description: 'Desc 2',
            quantity: 3,
            price: 15,
            rates: [],
            children: [],
          },
        ],
      };

      component.onSubmit();

      const submittedItem = itemService.updateItem.calls.mostRecent().args[0];
      expect(submittedItem.children[0].id).toBe(10);
      expect(submittedItem.children[1].id).toBeUndefined();
    });

    it('should successfully update item with valid data', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemService.updateItem.and.returnValue(of({} as any));
      component.item = {
        ...component.item,
        name: 'Test Item',
        description: 'Test Description',
      };

      component.onSubmit();

      expect(itemService.updateItem).toHaveBeenCalledWith(component.item);
      expect(location.back).toHaveBeenCalled();
    });
  });

  describe('addChildItem', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);
      fixture.detectChanges();
    });

    it('should add a new child item with temporary ID', () => {
      const initialChildCount = component.item.children.length;

      component.addChildItem();

      expect(component.item.children.length).toBe(initialChildCount + 1);
      const newChild = component.item.children[component.item.children.length - 1];
      expect(newChild.id?.toString().startsWith('temp-')).toBe(true);
      expect(newChild.name).toBe('');
      expect(newChild.quantity).toBe(0);
      expect(newChild.price).toBe(0);
    });

    it('should create unique temporary IDs for multiple child items', () => {
      component.addChildItem();
      component.addChildItem();

      const ids = component.item.children.map((child) => child.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('deleteChildItem', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);
      fixture.detectChanges();
      component.item.children = [
        {
          id: 1,
          name: 'Child 1',
          description: 'Desc 1',
          quantity: 5,
          price: 25,
          rates: [],
          children: [],
        },
        {
          id: 2,
          name: 'Child 2',
          description: 'Desc 2',
          quantity: 3,
          price: 15,
          rates: [],
          children: [],
        },
        {
          id: 'temp-123',
          name: 'Child 3',
          description: 'Desc 3',
          quantity: 2,
          price: 10,
          rates: [],
          children: [],
        },
      ];
    });

    it('should delete child item by numeric ID', () => {
      component.deleteChildItem(1);

      expect(component.item.children.length).toBe(2);
      expect(component.item.children.find((child) => child.id === 1)).toBeUndefined();
    });

    it('should delete child item by string ID', () => {
      component.deleteChildItem('temp-123');

      expect(component.item.children.length).toBe(2);
      expect(component.item.children.find((child) => child.id === 'temp-123')).toBeUndefined();
    });

    it('should not affect other children when deleting one', () => {
      const child2 = component.item.children[1];
      component.deleteChildItem(1);

      expect(component.item.children.find((child) => child.id === 2)).toEqual(child2);
    });
  });

  describe('addRate', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);
      fixture.detectChanges();
    });

    it('should add a new rate with temporary ID', () => {
      const initialRateCount = component.item.rates.length;

      component.addRate();

      expect(component.item.rates.length).toBe(initialRateCount + 1);
      const newRate = component.item.rates[component.item.rates.length - 1];
      expect(newRate.id?.toString().startsWith('temp-')).toBe(true);
      expect(newRate.minDays).toBe(0);
      expect(newRate.dailyRate).toBe(0);
      expect(newRate.isActive).toBe(true);
    });

    it('should create unique temporary IDs for multiple rates', () => {
      component.addRate();
      component.addRate();

      const ids = component.item.rates.map((rate) => rate.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('deleteRate', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);
      fixture.detectChanges();
      component.item.rates = [
        { id: 1, minDays: 1, dailyRate: 50, isActive: true },
        { id: 2, minDays: 7, dailyRate: 40, isActive: true },
        { id: 3, minDays: 14, dailyRate: 35, isActive: true },
      ];
    });

    it('should delete rate by ID', () => {
      component.deleteRate(2);

      expect(component.item.rates.length).toBe(2);
      expect(component.item.rates.find((rate) => rate.id === 2)).toBeUndefined();
    });

    it('should not affect other rates when deleting one', () => {
      const rate1 = component.item.rates[0];
      component.deleteRate(2);

      expect(component.item.rates.find((rate) => rate.id === 1)).toEqual(rate1);
    });

    it('should handle deleting non-existent rate ID gracefully', () => {
      const initialRateCount = component.item.rates.length;
      component.deleteRate(999);

      expect(component.item.rates.length).toBe(initialRateCount);
    });
  });
});

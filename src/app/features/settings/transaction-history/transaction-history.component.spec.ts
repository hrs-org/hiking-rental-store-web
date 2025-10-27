import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { Router } from '@angular/router';
import { selectUser } from '../../../state/user/user.selector';
import { selectOrderById } from '../../../state/order/orders.selector';
import { loadTransactionHistoryOrders } from '../../../state/order/orders.actions';
import { User } from '../../../core/models/user/user';
import {
  Order,
  OrderChannel,
  OrderPaymentType,
  OrderStatus,
} from '../../../core/models/order/order';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let store: MockStore;
  let routerSpy: { navigate: jasmine.Spy };

  beforeEach(async () => {
    routerSpy = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [TransactionHistoryComponent],
      providers: [provideMockStore(), { provide: Router, useValue: routerSpy }],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectUser, null);
    store.overrideSelector(selectOrderById, []);

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTransactionHistoryOrders when user exists on init', () => {
    spyOn(store, 'dispatch');
    store.overrideSelector(selectUser, { id: 42 } as User);
    store.refreshState();
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(loadTransactionHistoryOrders({ customerId: 42 }));
  });

  it('should navigate to transaction-details on order click', () => {
    component.handleOrderClick(123);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['transaction-details', 123]);
  });

  it('should not dispatch when user is null on init', () => {
    spyOn(store, 'dispatch');
    store.overrideSelector(selectUser, null);
    store.refreshState();
    component.ngOnInit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should set userId when user exists', () => {
    store.overrideSelector(selectUser, { id: 7 } as User);
    store.refreshState();
    component.ngOnInit();
    expect(component.userId).toBe(7);
  });

  it('orderList$ should emit selector values', (done) => {
    const mockOrders: Order[] = [
      {
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
        channel: OrderChannel.Online,
        paymentType: OrderPaymentType.Cash,
        totalAmount: 100,
        status: OrderStatus.Completed,
        items: [],
        packages: [],
      } as Order,
    ];

    store.overrideSelector(selectOrderById, mockOrders);
    store.refreshState();

    component.orderList$.subscribe((orders) => {
      expect(orders).toEqual(mockOrders);
      done();
    });
  });
});

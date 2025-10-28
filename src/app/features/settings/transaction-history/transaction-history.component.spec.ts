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

  it('should dispatch only once even if user selector emits multiple times', () => {
    // create a fresh component instance so ngOnInit isn't already called
    store.overrideSelector(selectUser, null);
    store.refreshState();

    const freshFixture = TestBed.createComponent(TransactionHistoryComponent);
    const freshComp = freshFixture.componentInstance;

    spyOn(store, 'dispatch');

    // first emission (this should trigger dispatch)
    store.overrideSelector(selectUser, { id: 9 } as User);
    store.refreshState();

    // subscribe by calling ngOnInit manually (avoid detectChanges auto-calling it)
    freshComp.ngOnInit();

    // second emission - because the component used take(1), this should NOT trigger a second dispatch
    store.overrideSelector(selectUser, { id: 10 } as User);
    store.refreshState();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(loadTransactionHistoryOrders({ customerId: 9 }));
  });

  it('orderList$ should receive multiple emissions in order', (done) => {
    const seq: Order[][] = [];
    // start with empty list
    store.overrideSelector(selectOrderById, []);
    store.refreshState();

    const testDate1 = new Date('2025-10-28T16:31:09Z');
    const testDate2 = new Date('2025-10-28T17:31:09Z');
    const expectedOrder: Order = {
      id: 11,
      startDate: testDate1,
      endDate: testDate2,
      channel: OrderChannel.Online,
      paymentType: OrderPaymentType.Cash,
      totalAmount: 50,
      status: OrderStatus.Completed,
      items: [],
      packages: [],
    } as Order;

    const sub = component.orderList$.subscribe((orders) => {
      seq.push(orders as Order[]);
      // when we've collected two emissions, assert and finish
      if (seq.length === 2) {
        expect(seq[0]).toEqual([]);
        expect(seq[1].length).toBe(1);
        expect(seq[1][0].id).toBe(expectedOrder.id);
        expect(seq[1][0].startDate).toEqual(expectedOrder.startDate);
        expect(seq[1][0].endDate).toEqual(expectedOrder.endDate);
        expect(seq[1][0].channel).toBe(expectedOrder.channel);
        expect(seq[1][0].paymentType).toBe(expectedOrder.paymentType);
        expect(seq[1][0].totalAmount).toBe(expectedOrder.totalAmount);
        expect(seq[1][0].status).toBe(expectedOrder.status);
        sub.unsubscribe();
        done();
      }
    });

    // emit new value
    store.overrideSelector(selectOrderById, [expectedOrder]);
    store.refreshState();
  });

  it('should not dispatch if user is null at subscription and becomes available later', () => {
    // prepare fresh component so ngOnInit subscription happens in test
    store.overrideSelector(selectUser, null);
    store.refreshState();

    const freshFixture = TestBed.createComponent(TransactionHistoryComponent);
    const freshComp = freshFixture.componentInstance;

    spyOn(store, 'dispatch');

    // call ngOnInit (will pick up current null and complete due to take(1))
    freshComp.ngOnInit();

    // later the selector emits a user, but take(1) already completed
    store.overrideSelector(selectUser, { id: 99 } as User);
    store.refreshState();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('template rendering', () => {
    it('should show no transactions message when order list is empty', () => {
      store.overrideSelector(selectOrderById, []);
      store.refreshState();
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('No transactions history.');
    });

    it('should render app-order-item elements when orders are present', () => {
      const orders: Order[] = [
        {
          id: 21,
          startDate: new Date(),
          endDate: new Date(),
          channel: OrderChannel.Online,
          paymentType: OrderPaymentType.Cash,
          totalAmount: 10,
          status: OrderStatus.Completed,
          items: [],
          packages: [],
        } as Order,
        {
          id: 22,
          startDate: new Date(),
          endDate: new Date(),
          channel: OrderChannel.Online,
          paymentType: OrderPaymentType.Cash,
          totalAmount: 20,
          status: OrderStatus.Completed,
          items: [],
          packages: [],
        } as Order,
      ];

      store.overrideSelector(selectOrderById, orders);
      store.refreshState();
      fixture.detectChanges();

      const orderItems = fixture.nativeElement.querySelectorAll('app-order-item');
      expect(orderItems.length).toBe(orders.length);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDetailsComponent } from './transaction-details.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import {
  Order,
  OrderStatus,
  OrderChannel,
  OrderPaymentType,
} from '../../../../core/models/order/order';
import { OrderService } from '../../../../core/services/order.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ApiResponse } from '../../../../core/models/api-response';

describe('TransactionDetailsComponent', () => {
  let component: TransactionDetailsComponent;
  let fixture: ComponentFixture<TransactionDetailsComponent>;
  let orderService: jasmine.SpyObj<OrderService>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  const mockOrder: Order = {
    id: 5,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-02'),
    channel: OrderChannel.Online,
    paymentType: OrderPaymentType.Cash,
    totalAmount: 200,
    status: OrderStatus.Pending,
    items: [],
    packages: [],
  } as Order;

  beforeEach(async () => {
    orderService = jasmine.createSpyObj('OrderService', ['getOrderById']);
    loadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    // default route returns id '5'
    const activatedRouteMock = {
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('5') } },
    } as unknown as ActivatedRoute;

    // return a fresh copy each time to avoid cross-test mutation
    orderService.getOrderById.and.returnValue(
      of({ success: true, message: '', data: { ...mockOrder } } as ApiResponse<Order>),
    );

    await TestBed.configureTestingModule({
      imports: [TransactionDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: OrderService, useValue: orderService },
        { provide: LoadingService, useValue: loadingService },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;

    fixture = TestBed.createComponent(TransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and call loading/show/hide and load order', () => {
    expect(component).toBeTruthy();
    expect(loadingService.show).toHaveBeenCalled();
    expect(orderService.getOrderById).toHaveBeenCalledWith(5);
    expect(loadingService.hide).toHaveBeenCalled();
    expect(component.order.id).toBe(5);
  });

  it('should set title to Pending Booking when order is pending', () => {
    component.ngOnInit();
    expect(component.isPending()).toBeTrue();
    expect(component.title).toBe('Pending Booking');
  });

  it('formatDate should format date correctly', () => {
    const formatted = component.formatDate(new Date('2025-02-03'));
    expect(formatted).toBe('02/03/2025');
  });

  it('isBooked should return false for pending order and getStatusClass should reflect status', () => {
    expect(component.isBooked()).toBeFalse();
    expect(component.getStatusClass()).toBe('order-status-pending');
  });

  it('should handle no-data response from orderService and set title to Booking Details', () => {
    // make orderService return no data
    (orderService.getOrderById as jasmine.Spy).and.returnValue(
      of({ success: true, message: '', data: null }),
    );

    const nf = TestBed.createComponent(TransactionDetailsComponent);
    const comp = nf.componentInstance;

    // inject mocks into new instance by re-providing (TestBed providers already set)
    nf.detectChanges();

    // Since data is null, title should fall back to 'Booking Details'
    expect(comp.title).toBe('Booking Details');
    expect(comp.order).toEqual({} as Order);
  });

  it('should return true for isBooked when status is Booked and getStatusClass reflects it', () => {
    component.order.status = OrderStatus.Booked;
    expect(component.isBooked()).toBeTrue();
    expect(component.getStatusClass()).toBe('order-status-booked');
  });

  it('parses numeric orderId from route param and calls service with number', () => {
    const ar = TestBed.inject(ActivatedRoute) as ActivatedRoute & {
      snapshot: { paramMap: { get: () => string } };
    };
    ar.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue('7');

    (orderService.getOrderById as jasmine.Spy).and.returnValue(
      of({ success: true, message: '', data: { ...mockOrder, id: 7 } } as ApiResponse<Order>),
    );

    const nf = TestBed.createComponent(TransactionDetailsComponent);
    const comp = nf.componentInstance;
    nf.detectChanges();

    expect(comp.orderId).toBe(7);
    expect(orderService.getOrderById).toHaveBeenCalledWith(7);
  });

  it('should not hide loading when orderService throws an error', () => {
    (orderService.getOrderById as jasmine.Spy).and.returnValue(throwError(() => new Error('boom')));

    expect(() => {
      const nf = TestBed.createComponent(TransactionDetailsComponent);
      nf.detectChanges();
    }).toThrow();

    // loading.show should have been called before the error
    expect(loadingService.show).toHaveBeenCalled();
    // hide should NOT be called because observable errored before completion
    expect(loadingService.hide).not.toHaveBeenCalled();
  });

  it('getStatusClass returns "order-status-" when status is undefined', () => {
    component.order = {} as Order;
    expect(component.getStatusClass()).toBe('order-status-');
  });
});

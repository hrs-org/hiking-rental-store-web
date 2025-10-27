import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDetailsComponent } from './transaction-details.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
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

    orderService.getOrderById.and.returnValue(
      of({ success: true, message: '', data: mockOrder } as ApiResponse<Order>),
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
});

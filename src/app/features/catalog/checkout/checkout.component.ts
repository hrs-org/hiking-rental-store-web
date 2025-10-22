import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { Router } from '@angular/router';
import { CatalogEntry } from '../../../core/models/store/store';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../state/user/user.selector';
import { MatInputModule } from '@angular/material/input';
import { OrderChannel, OrderPaymentType, OrderRequest } from '../../../core/models/order/order';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { User, UserRole } from '../../../core/models/user/user';
import { OrderService } from '../../../core/services/order.service';
import { LoadingService } from '../../../core/services/loading.service';
import moment from 'moment';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentRequest } from '../../../core/models/payment/payment';

export interface Checkout {
  startDate: Date;
  endDate: Date;
  items: CatalogEntry[];
}

@Component({
  selector: 'app-checkout',
  providers: [provideNativeDateAdapter()],
  imports: [
    PwaHeaderComponent,
    MatButtonModule,
    AsyncPipe,
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private loadingService = inject(LoadingService);

  checkout?: Checkout;
  user$ = this.store.select(selectUser);
  user = {} as User;
  orderRequest = {} as OrderRequest;
  guestForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
  });
  orderForm = this.formBuilder.group({
    channel: new FormControl(OrderChannel.Online, Validators.required),
    startDate: new FormControl({ value: new Date(), disabled: true }, Validators.required),
    endDate: new FormControl({ value: new Date(), disabled: true }, Validators.required),
  });
  paymentTypeForm = this.formBuilder.group({
    paymentType: new FormControl(OrderPaymentType.Cash, Validators.required),
  });
  channelOptions = [
    { value: OrderChannel.POS, label: 'POS' },
    { value: OrderChannel.Manual, label: 'Manual' },
  ];
  paymentOptions = [
    { value: OrderPaymentType.Cash, label: 'Cash' },
    { value: OrderPaymentType.Other, label: 'Other' },
  ];

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.checkout = navigation?.extras.state?.['checkout'];

    if (!this.checkout) {
      const checkoutStr = localStorage.getItem('checkoutItems');
      if (checkoutStr) {
        this.checkout = JSON.parse(checkoutStr) as Checkout;
      }
    } else {
      localStorage.setItem('checkoutItems', JSON.stringify(this.checkout));
    }

    if (!this.checkout) {
      return;
    }

    const checkout = this.checkout;

    this.user$.subscribe((user) => {
      if (user) {
        this.user = user;

        this.orderRequest = {
          channel: OrderChannel.POS,
          paymentType: OrderPaymentType.Cash,
          startDate: checkout.startDate,
          endDate: checkout.endDate,
          items: checkout.items
            .filter((item) => item.selectedQty && item.selectedQty > 0)
            .map((item) => ({
              itemId: item.itemId!,
              quantity: item.selectedQty || 0,
            })),
        };

        if (user.role === 'Customer') {
          this.orderRequest.channel = OrderChannel.Online;
          this.orderRequest.paymentType = OrderPaymentType.Other;
          this.orderForm.patchValue({
            channel: OrderChannel.Online,
          });
          this.paymentTypeForm.patchValue({
            paymentType: OrderPaymentType.Other,
          });
        }

        this.orderForm.patchValue({
          channel: this.orderRequest.channel,
          startDate: this.orderRequest.startDate,
          endDate: this.orderRequest.endDate,
        });
      }
    });
  }

  onCancel(): void {
    this.location.back();
  }

  onPayment(): void {
    if (!this.isValid()) {
      return;
    }

    if (this.user.role === UserRole.Customer) {
      this.orderRequest.customerId = this.user.id;
    } else {
      this.orderRequest.guestName = this.guestForm.controls['name'].value!;
      this.orderRequest.guestPhone = this.guestForm.controls['phoneNumber'].value!.toString();
      this.orderRequest.channel = this.orderForm.controls['channel'].value!;
      this.orderRequest.paymentType = this.paymentTypeForm.controls['paymentType'].value!;
    }

    this.loadingService.show();
    this.orderService.createOrder(this.orderRequest).subscribe({
      next: (res) => {
        if (!res.data) {
          return;
        }
        localStorage.removeItem('checkoutItems');

        if (this.orderRequest.paymentType === OrderPaymentType.Other) {
          this.loadingService.show();
          const request = {
            amount: this.totalPrice(),
            orderId: res.data.id,
          } as PaymentRequest;
          this.paymentService.createPaymentSession(request).subscribe({
            next: (res) => {
              if (res.data?.client_secret) {
                localStorage.setItem('client_secret', res.data.client_secret);
                this.router.navigate(['/payment'], {
                  queryParams: { sessionId: res.data.client_secret },
                });
              }
            },
            complete: () => this.loadingService.hide(),
          });
        } else {
          this.router.navigate(['/store']);
        }
      },
      complete: () => this.loadingService.hide(),
    });
  }

  totalPrice(): number {
    if (!this.checkout) return 0;

    return this.checkout.items.reduce((total, item) => {
      const qty = item.selectedQty || 0;
      return total + item.dailyRate * qty * this.totalDays();
    }, 0);
  }

  isValid(): boolean {
    if (!this.orderRequest) return false;
    if (this.orderRequest.items && this.orderRequest.items.length === 0) return false;

    if (this.orderForm.invalid) return false;

    if (this.orderRequest.channel !== OrderChannel.Online) {
      if (this.guestForm.invalid) return false;
    }

    if (this.user.role !== UserRole.Customer) {
      if (this.paymentTypeForm.invalid) return false;
    }

    return true;
  }

  totalDays(): number {
    if (!this.orderRequest?.startDate || !this.orderRequest?.endDate) return 0;

    return moment(this.orderRequest.endDate).diff(moment(this.orderRequest.startDate), 'days');
  }
}

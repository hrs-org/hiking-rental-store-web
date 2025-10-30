import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, NgClass } from '@angular/common';
import moment from 'moment';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../../../core/services/order.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { PwaHeaderComponent } from '../../../../shared/components/pwa-header/pwa-header.component';
import { BookingDetailItemsComponent } from '../../../booking/booking-details/booking-detail-items/booking-detail-items.component';
import { Order, OrderStatus } from '../../../../core/models/order/order';

@Component({
  selector: 'app-transaction-details',
  imports: [PwaHeaderComponent, MatDivider, BookingDetailItemsComponent, MatButtonModule, NgClass],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.scss',
})
export class TransactionDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly loadingService = inject(LoadingService);
  private readonly location = inject(Location);

  orderId = Number(this.route.snapshot.paramMap.get('id'));
  order: Order = {} as Order;
  title = '';

  ngOnInit(): void {
    this.loadingService.show();
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        if (res.data) this.order = res.data;
        this.title = this.isPending() ? 'Pending Booking' : 'Booking Details';
      },
      error: () => {
        this.loadingService.hide();
      },
      complete: () => this.loadingService.hide(),
    });
  }

  formatDate(date: Date): string {
    return moment(date).format('MM/DD/YYYY');
  }

  isPending(): boolean {
    return this.order.status === OrderStatus.Pending;
  }

  isBooked(): boolean {
    return this.order.status === OrderStatus.Booked;
  }

  // onCancel(): void {
  //   if (this.isPending()) {
  //     this.loadingService.show();
  //     this.orderService
  //       .cancelOrder(this.order.id)
  //       .pipe(finalize(() => this.loadingService.hide()))
  //       .subscribe((res) => {
  //         if (res.data) {
  //           this.location.back();
  //         }
  //       });
  //   } else {
  //     this.location.back();
  //   }
  // }

  // onSubmit(): void {
  //   this.loadingService.show();
  //   if (this.isPending()) {
  //     this.orderService
  //       .approveOrder(this.order.id)
  //       .pipe(finalize(() => this.loadingService.hide()))
  //       .subscribe((res) => {
  //         if (res.data) {
  //           this.location.back();
  //         }
  //       });
  //   } else if (this.isBooked()) {
  //     this.orderService
  //       .confirmOrder(this.order.id)
  //       .pipe(finalize(() => this.loadingService.hide()))
  //       .subscribe((res) => {
  //         if (res.data) {
  //           this.location.back();
  //         }
  //       });
  //   }
  // }

  getStatusClass(): string {
    return 'order-status-' + (this.order.status?.toLocaleLowerCase() || '');
  }
}

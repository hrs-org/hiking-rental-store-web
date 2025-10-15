import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { finalize, tap } from 'rxjs';
import {
  Order,
  ReturnRentalOrderItem,
  ReturnRentalOrderItemRequest,
} from '../../../core/models/order/order';
import moment from 'moment';
import { MatDivider } from '@angular/material/divider';
import { ReturnDetailItemsComponent } from './return-detail-items/return-detail-items.component';
import { MatButton } from '@angular/material/button';
import { Location } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-return-details',
  imports: [PwaHeaderComponent, MatDivider, ReturnDetailItemsComponent, MatButton],
  templateUrl: './return-details.component.html',
  styleUrl: './return-details.component.scss',
})
export class ReturnDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly loadingService = inject(LoadingService);
  private readonly location = inject(Location);

  itemId = Number(this.route.snapshot.paramMap.get('id'));
  order: Order = {} as Order;
  showOrderDetails = false;
  selectedQuantities: Record<number, ReturnRentalOrderItem> = {};

  ngOnInit(): void {
    this.fetchOrder();
  }

  private fetchOrder(): void {
    this.loadingService.show();
    this.orderService
      .getOrderById(this.itemId)
      .pipe(
        tap((res) => {
          const orderData = res.data;
          if (orderData) {
            this.order = orderData;
            this.selectedQuantities = {};
            orderData.items?.forEach((item) => {
              this.selectedQuantities[item.id] = {
                rentalOrderItemId: item.id,
                goodQty: 0,
                repairQty: 0,
                damagedQty: 0,
                lostQty: 0,
              };
            });
          }
        }),
        finalize(() => this.loadingService.hide()),
      )
      .subscribe();
  }

  formatDate(date: Date): string {
    return moment(date).format('MM/DD/YYYY');
  }

  updateReturnQuantity(event: { orderItemId: number; returnQty: ReturnRentalOrderItem }) {
    this.selectedQuantities = {
      ...this.selectedQuantities,
      [event.orderItemId]: {
        ...this.selectedQuantities[event.orderItemId],
        ...event.returnQty,
      },
    };
  }

  private mapToReturnRentalOrderItemRequest(): ReturnRentalOrderItemRequest {
    const items: ReturnRentalOrderItem[] = Object.entries(this.selectedQuantities).map(
      ([key, value]) => ({
        ...value,
        rentalOrderItemId: Number(key),
      }),
    );
    return { items };
  }

  onCancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    const request = this.mapToReturnRentalOrderItemRequest();
    this.loadingService.show();
    this.orderService
      .returnOrderItem(this.order.id, request)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((res) => {
        if (res.data) {
          this.location.back();
        }
      });
  }

  validReturn(): boolean {
    return Object.entries(this.selectedQuantities).every(([key, value]) => {
      const total =
        (value.goodQty ?? 0) +
        (value.repairQty ?? 0) +
        (value.damagedQty ?? 0) +
        (value.lostQty ?? 0);
      const orderItem = this.order.items?.find((item) => item.id === Number(key));
      return orderItem ? total >= orderItem.quantity : false;
    });
  }
}

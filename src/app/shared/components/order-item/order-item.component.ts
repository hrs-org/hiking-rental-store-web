import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Order } from '../../../core/models/order/order';
import moment from 'moment';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-item',
  imports: [CurrencyPipe, NgClass, NgIf],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent implements OnInit, OnDestroy {
  @Input() showDelete = false;
  @Input() order?: Order;
  @Output() orderClick = new EventEmitter<string>();
  @Output() deleteClick = new EventEmitter<string | { id: string; auto?: boolean }>();
  countdown = '';
  private timer?: ReturnType<typeof setInterval>;
  private cdr = inject(ChangeDetectorRef);

  formatDate(date?: Date) {
    if (!date) return '';
    return moment(date).format('MM/DD/YYYY');
  }

  ngOnInit(): void {
    if (this.order?.status === 'PendingPayment' && this.getCreatedAt()) {
      this.updateCountdown();
      this.timer = setInterval(() => this.updateCountdown(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private getCreatedAt(): Date | null {
    const val = (this.order as { createdAt?: string | Date })?.createdAt;
    if (!val) return null;
    if (typeof val === 'string') {
      let fixed = val.replace(/\..*$/, '');
      if (!/Z|[+-]\d{2}:?\d{2}$/.test(fixed)) fixed += 'Z';
      const parsed = Date.parse(fixed);
      if (!isNaN(parsed)) return new Date(parsed);
      return null;
    }
    if (val instanceof Date) return val;
    return null;
  }

  private updateCountdown() {
    const createdAt = this.getCreatedAt();
    if (!createdAt) {
      this.countdown = '';
      this.cdr.markForCheck();
      return;
    }
    const expire = new Date(createdAt.getTime() + 1 * 60 * 1000);
    const now = new Date();
    const diff = Math.max(0, Math.floor((expire.getTime() - now.getTime()) / 1000));
    if (diff === 0) {
      if (this.order?.id) {
        this.deleteClick.emit({ id: this.order.id, auto: true });
      }
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
      this.countdown = '';
      this.cdr.markForCheck();
      return;
    }
    const min = Math.floor(diff / 60)
      .toString()
      .padStart(2, '0');
    const sec = (diff % 60).toString().padStart(2, '0');
    this.countdown = `${min}:${sec}`;
    this.cdr.markForCheck();
  }

  onClick() {
    if (this.order?.id) {
      this.orderClick.emit(this.order.id);
    }
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.order?.id) {
      this.deleteClick.emit(this.order.id);
    }
  }
}

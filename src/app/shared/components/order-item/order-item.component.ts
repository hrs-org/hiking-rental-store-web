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
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-order-item',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent implements OnInit, OnDestroy {
  @Input() showDelete = false;
  @Input() order?: Order;
  @Output() orderClick = new EventEmitter<number>();
  @Output() deleteClick = new EventEmitter<number>();
  @Output() countdownEnd = new EventEmitter<number>();
  private cdr = inject(ChangeDetectorRef);

  countdown: number | null = null;
  private timer: ReturnType<typeof setInterval> | undefined;

  formatDate(date?: Date) {
    if (!date) return '';
    return moment(date).format('MM/DD/YYYY');
  }

  ngOnInit(): void {
    if (
      this.order?.status === 'PendingPayment' &&
      typeof this.order.pendingSeconds === 'number' &&
      this.order.pendingSeconds >= 0
    ) {
      this.countdown = this.order.pendingSeconds;
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  startCountdown() {
    this.timer = setInterval(() => {
      if (this.countdown === null) return;
      if (this.countdown > 0) {
        this.countdown--;
        this.cdr.markForCheck();
      } else {
        clearInterval(this.timer);
        if (this.order?.id) {
          this.deleteClick.emit(this.order.id);
        }
      }
    }, 1000);
  }

  get countdownDisplay(): string {
    if (this.countdown === null) return '';
    const m = Math.floor(this.countdown / 60);
    const s = this.countdown % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onClick() {
    this.orderClick.emit(this.order?.id);
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    this.deleteClick.emit(this.order?.id);
  }
}

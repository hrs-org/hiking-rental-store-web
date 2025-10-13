import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { PaymentService } from '../../../core/services/payment.service';
import { selectUser } from '../../../store/user/user.selector';
import { Store } from '@ngrx/store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-returnpage',
  imports: [PwaHeaderComponent, CommonModule],
  templateUrl: './payment-returnpage.component.html',
  styleUrl: './payment-returnpage.component.scss',
})
export class PaymentReturnpageComponent implements OnInit {
  private paymentservice = inject(PaymentService);
  private store = inject(Store);
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  title = 'VerifyPayment';
  clientSecret: string | null = null;
  user$ = this.store.select(selectUser);
  useremail = '';
  message = 'Payment status unknown';
  countdown = 10; // ⏱ countdown starts at 10 seconds

  ngOnInit(): void {
    console.log('start');
    this.user$.subscribe((user) => {
      if (user) {
        this.useremail = user.email;
      }
    });
    const storedSecret = localStorage.getItem('client_secret');
    if (storedSecret) {
      this.clientSecret = storedSecret;
      this.verifyPayment(this.clientSecret);
    } else {
      this.bottomSheet
        .open(InfoBottomSheetComponent, {
          data: {
            title: 'ERROR',
            description: "Can't Receive {client_secret} ",
          },
        })
        .afterDismissed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.router.navigate(['settings']);
          }
        });
    }
    this.startCountdown();
  }

  private verifyPayment(secret: string) {
    this.paymentservice.verifyCheckout(secret, this.useremail).subscribe({
      next: (response) => {
        if (response?.data?.status) {
          this.message = `Payment status: ${response.data.status}`;
        } else {
          this.message = response.message || 'Unable to retrieve payment status.';
        }
      },
    });
  }

  private startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.router.navigate(['store']);
      }
    }, 1000);
  }
}

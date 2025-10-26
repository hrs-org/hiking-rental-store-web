import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../../shared/components/pwa-header/pwa-header.component';
import { PaymentService } from '../../../../core/services/payment.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

@Component({
  selector: 'app-verify',
  imports: [PwaHeaderComponent],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent implements OnInit {
  private paymentservice = inject(PaymentService);
  private store = inject(Store);
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  clientSecret: string | null = null;
  message = 'Payment status unknown';
  countdown = 10;

  ngOnInit(): void {
    const storedSecret = localStorage.getItem('client_secret');
    if (storedSecret) {
      this.clientSecret = storedSecret;
      this.verifyPayment(this.clientSecret);
    } else {
      this.bottomSheet
        .open(InfoBottomSheetComponent, {
          data: {
            title: 'Error',
            description: "Can't Receive session ID.",
          },
        })
        .afterDismissed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.router.navigate(['store']);
          }
        });
    }
    this.startCountdown();
  }

  private verifyPayment(secret: string) {
    this.paymentservice.verifyCheckout({ secretKey: secret }).subscribe({
      next: (response) => {
        if (response) {
          this.message = response.message;
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

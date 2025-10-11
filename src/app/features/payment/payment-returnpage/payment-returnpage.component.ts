import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { PaymentService } from '../../../core/services/payment.service';
import { selectUser } from '../../../store/user/user.selector';
import { Store } from '@ngrx/store';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment-returnpage',
  imports: [PwaHeaderComponent],
  templateUrl: './payment-returnpage.component.html',
  styleUrl: './payment-returnpage.component.scss',
})
export class PaymentReturnpageComponent implements OnInit {
  private paymentservice = inject(PaymentService);
  private store = inject(Store);
  private bottomSheet = inject(MatBottomSheet);
  location = inject(Location);

  title = 'VerifyPayment';
  clientSecret: string | null = null;
  user$ = this.store.select(selectUser);
  useremail = '';
  message = 'Payment status unknown';

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
          },
        })
        .afterDismissed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.location.go('settings');
          }
        });
    }
  }

  private verifyPayment(secret: string) {
    this.paymentservice.verifyCheckout(secret, this.useremail).subscribe({
      next: (response) => {
        this.message = response.message;
      },
    });
  }
}

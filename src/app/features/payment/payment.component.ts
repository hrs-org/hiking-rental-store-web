import { Component, AfterViewInit, inject, OnDestroy } from '@angular/core';
import { loadStripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { PwaHeaderComponent } from '../../shared/components/pwa-header/pwa-header.component';
import { PaymentService } from '../../core/services/payment.service';
import { firstValueFrom } from 'rxjs';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [PwaHeaderComponent],
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
  title = 'Test Payment';
  private stripePromise = loadStripe(
    'pk_test_51SGPODCnKKTOv8A0cxsifksvBbtKMH0d1PcKMgd5fyIGvVmY8M4BytKqmmWhdga5VMqRKplGNVDTSjhimnA90OoI000TGDvBm3',
  );
  private paymentservice = inject(PaymentService);
  private embeddedCheckout: StripeEmbeddedCheckout | null = null;
  private bottomSheet = inject(MatBottomSheet);
  location = inject(Location);

  async ngAfterViewInit() {
    await this.initializeCheckout();
  }

  private async initializeCheckout() {
    if (this.embeddedCheckout) {
      this.bottomSheet
        .open(InfoBottomSheetComponent, {
          data: {
            title: 'ERROR',
            description: 'Embedded checkout already initialized',
          },
        })
        .afterDismissed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.location.back();
          }
        });
      console.log('Embedded checkout already initialized');
      return;
    }
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    const response = await firstValueFrom(this.paymentservice.checkoutCart());
    if (!response.data) {
      throw new Error('Missing clientSecret from server');
    }
    const secret = response.data?.clientSecret ?? response.data;
    if (typeof secret !== 'string') {
      throw new Error('clientSecret must be a string');
    }

    this.embeddedCheckout = await stripe.initEmbeddedCheckout({
      clientSecret: secret,
    });
    this.embeddedCheckout.mount('#checkout');
  }

  ngOnDestroy() {
    // cleanup
    if (this.embeddedCheckout) {
      this.embeddedCheckout.destroy();
      this.embeddedCheckout = null;
    }
    console.log('');
  }
}

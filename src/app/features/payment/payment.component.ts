import { Component, AfterViewInit, inject, OnDestroy } from '@angular/core';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeEmbeddedCheckout,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { PwaHeaderComponent } from '../../shared/components/pwa-header/pwa-header.component';
import { PaymentService } from '../../core/services/payment.service';
import { firstValueFrom } from 'rxjs';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';
import { StripeService } from 'ngx-stripe';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [PwaHeaderComponent],
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
  private stripePromise = loadStripe(
    'pk_test_51SGPODCnKKTOv8A0cxsifksvBbtKMH0d1PcKMgd5fyIGvVmY8M4BytKqmmWhdga5VMqRKplGNVDTSjhimnA90OoI000TGDvBm3',
  );
  private paymentservice = inject(PaymentService);
  private embeddedCheckout: StripeEmbeddedCheckout | null = null;
  private bottomSheet = inject(MatBottomSheet);
  private stripe = inject(StripeService);
  location = inject(Location);
  title = 'Test Payment';

  elements!: StripeElements;
  paymentElement!: StripePaymentElement;
  clientSecret!: string;
  private stripeInstance!: Stripe | null;

  //vsersion @stripe/stripe-js'
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
    this.clientSecret = secret;
    this.paymentservice['clientSecretSource'].next(this.clientSecret);
    localStorage.setItem('client_secret', this.clientSecret);
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
  }

  // NGX stripe
  // async ngAfterViewInit() {
  //   try {
  //     this.stripeInstance = await this.stripePromise;

  //     if (!this.stripeInstance) {
  //       throw new Error('Stripe failed to load.');
  //     }

  //     const response = await firstValueFrom(this.paymentservice.checkoutCart());

  //     if (!response.data) throw new Error('Missing clientSecret from server');

  //     // let clientSecret: string;
  //     console.log(response);
  //     const clientSecret = response.data;

  //     this.clientSecret = clientSecret;
  //     console.log('Final ClientSecret being used:', this.clientSecret);

  //     // 2. Initialize elements using the native Stripe instance
  //     this.elements = this.stripeInstance.elements({ clientSecret: this.clientSecret });

  //     this.paymentElement = this.elements.create('payment') as StripePaymentElement;
  //     this.paymentElement.mount('#checkout');
  //   } catch (err) {
  //     this.bottomSheet
  //       .open(InfoBottomSheetComponent, {
  //         data: { title: 'ERROR', description: 'Payment initialization failed' },
  //       })
  //       .afterDismissed()
  //       .subscribe(() => this.location.back());
  //     console.error(err);
  //   }
  // }

  // async pay() {
  //   const stripe = inject(StripeService);
  //   stripe
  //     .confirmPayment({
  //       elements: this.elements,
  //       confirmParams: { return_url: window.location.href },
  //     })
  //     .subscribe((result) => {
  //       if (result.error) {
  //         console.error(result.error.message);
  //       } else {
  //         console.log('Payment confirmed', result);
  //       }
  //     });
  // }

  // ngOnDestroy() {
  //   if (this.paymentElement) {
  //     this.paymentElement.destroy();
  //   }
  // }
}

import { Component, AfterViewInit, inject } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { PwaHeaderComponent } from '../../shared/components/pwa-header/pwa-header.component';
import { PaymentService } from '../../core/services/payment.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [PwaHeaderComponent],
})
export class PaymentComponent implements AfterViewInit {
  title = 'Test Payment';
  private stripePromise = loadStripe(
    'pk_test_51SGPODCnKKTOv8A0cxsifksvBbtKMH0d1PcKMgd5fyIGvVmY8M4BytKqmmWhdga5VMqRKplGNVDTSjhimnA90OoI000TGDvBm3',
  );
  private paymentservice = inject(PaymentService);

  async ngAfterViewInit() {
    await this.initializeCheckout();
  }

  private async initializeCheckout() {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    const response = await firstValueFrom(this.paymentservice.checkoutPrice('krit', 555));
    if (!response.data) {
      throw new Error('Missing clientSecret from server');
    }
    const secret = response.data?.clientSecret ?? response.data;
    if (typeof secret !== 'string') {
      throw new Error('clientSecret must be a string');
    }

    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret: secret,
    });
    checkout.mount('#checkout');
  }
}

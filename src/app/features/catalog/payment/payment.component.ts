import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { loadStripe, Stripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';

@Component({
  selector: 'app-payment',
  imports: [PwaHeaderComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
  private stripe: Stripe | null = null;
  private embeddedCheckout: StripeEmbeddedCheckout | null = null;
  private bottomSheet = inject(MatBottomSheet);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  private clientSecret: string | null = null;

  async ngAfterViewInit(): Promise<void> {
    try {
      this.route.queryParamMap.subscribe(async (params) => {
        this.clientSecret = params.get('sessionId');

        if (!this.clientSecret) {
          this.showErrorBottomSheet('Missing payment session.');
          return;
        }

        if (this.embeddedCheckout) {
          this.showErrorBottomSheet('Embedded checkout already initialized');
          return;
        }

        this.stripe = await loadStripe(environment.stripePublicKey);
        if (!this.stripe) {
          this.showErrorBottomSheet('Stripe failed to initialize');
          return;
        }

        this.embeddedCheckout = await this.stripe.initEmbeddedCheckout({
          clientSecret: this.clientSecret,
        });

        this.embeddedCheckout.mount('#checkout');
      });
    } catch (error) {
      this.showErrorBottomSheet(`Stripe error: ${error}`);
    }
  }

  ngOnDestroy(): void {
    this.stripe = null;
    if (this.embeddedCheckout) {
      this.embeddedCheckout.destroy();
      this.embeddedCheckout = null;
    }
  }

  private showErrorBottomSheet(description: string): void {
    this.bottomSheet
      .open(InfoBottomSheetComponent, {
        data: {
          title: 'Error',
          description,
        },
      })
      .afterDismissed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.location.back();
        }
      });
  }
}

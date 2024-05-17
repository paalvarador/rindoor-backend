import { Body, Controller, Inject, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionsService } from '../subscriptions.service';

@Controller('stripe/webhook')
export class StripeWebHookController {
  private readonly stripe: Stripe;
  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private readonly subscriptionsService: SubscriptionsService,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-04-10',
    });
  }

  @Post()
  async handleStripeEvent(@Body() event: any) {
    if (event.type === 'checkout.session.completed') {
      const subscriptionId = event.data.object.subscription;
      const customerId = event.data.object.customer;
      const customerEmail = event.data.object.customer_details.email;

      const sub: Stripe.Subscription =
        (await this.stripe.subscriptions.retrieve(
          subscriptionId,
        )) as Stripe.Subscription;

      const formatSub = sub as Stripe.Subscription & {
        plan: {
          id: string;
        };
      };
      console.log('***************PASA POR AQUI***************', formatSub);
      const planId = formatSub.plan.id;
      this.subscriptionsService.verifyPayment(
        subscriptionId,
        customerId,
        customerEmail,
        planId,
      );
    }
  }
}

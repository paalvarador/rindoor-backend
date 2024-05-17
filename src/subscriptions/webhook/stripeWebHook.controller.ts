import { Body, Controller, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionsService } from '../subscriptions.service';

@Controller('stripe/webhook')
export class StripeWebHookController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async handleStripeEvent(@Body() event: any) {
    if (event.type === 'checkout.session.completed') {
      const subscriptionId = event.data.object.subscription;
      const customerId = event.data.object.customer;
      const customerEmail = event.data.object.customer_details.email;

      const sub: Stripe.Subscription =
        (await this.subscriptionsService.getSubscription(
          event.data.object.subscription,
        )) as Stripe.Subscription;

      const formatSub = sub as Stripe.Subscription & {
        plan: {
          id: string;
        };
      };
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

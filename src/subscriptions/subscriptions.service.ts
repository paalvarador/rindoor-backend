import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionDto } from './dto/Subscription.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private readonly userService: UserService,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-04-10',
    });
  }

  async getSubscriptions(): Promise<SubscriptionDto[]> {
    const prices = await this.stripe.prices.list();
    const formatSubscriptions = prices.data.map((price) => {
      return {
        price: Number.parseFloat((price.unit_amount / 100).toFixed(2)),
        name: `${price.unit_amount / 100}.00 ${price.currency}/${price.recurring.interval} `,
        currency: price.currency,
        price_cents: price.unit_amount,
        interval: price.recurring.interval,
        id: price.id,
      };
    });
    return formatSubscriptions;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});
    return customers.data;
  }

  async checkoutSubscription(priceId: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const subscription = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    return subscription;
  }
}

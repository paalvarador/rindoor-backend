import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/Subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private readonly userService: UserService,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-04-10',
    });
  }

  async getPlans(): Promise<any[]> {
    const plans = await this.stripe.plans.list();
    const formatSubscriptions = plans.data.map((plan) => {
      return {
        price: Number.parseFloat((plan.amount / 100).toFixed(2)),
        name: `${plan.amount / 100}.00 ${plan.currency}/${plan.interval} `,
        currency: plan.currency,
        price_cents: plan.amount,
        interval: plan.interval,
        id: plan.id,
      };
    });
    return formatSubscriptions;
  }

  async checkoutSubscription(planId: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('Usuário no encontrado');
    }

    const plan = await this.getPlan(planId);

    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }

    const subscription = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price: planId,
        },
      ],
      success_url: 'http://localhost:3000/stripe/success',
      cancel_url: 'http://localhost:3000/stripe/cancel',
    });

    const planDB = await this.getSubscription(planId);

    this.subscriptionRepository
      .save({
        id: subscription.id,
        price: planDB.price,
        name: planDB.name,
        currency: planDB.currency,
        price_cents: planDB.price_cents,
        interval: planDB.interval,
      })
      .then(() => {
        this.userService.chooseSubscription(subscription.id, userId);
      });

    return { url: subscription.url };
  }

  async getPlan(planId: string) {
    const plan = await this.stripe.plans.retrieve(planId);
    return plan;
  }

  async getSubscription(subscriptionId: string) {
    const subscriptions = await this.stripe.plans.list();
    const subscription = subscriptions.data.find(
      (sub) => sub.id === subscriptionId,
    );
    const tranformSubscription = {
      price: Number.parseFloat((subscription.amount / 100).toFixed(2)),
      name: `${subscription.amount / 100}.00 ${subscription.currency}/${subscription.interval} `,
      currency: subscription.currency,
      price_cents: subscription.amount,
      interval: subscription.interval,
      id: subscription.id,
    };
    return tranformSubscription;
  }
}

import {
  Inject,
  Injectable,
  NotFoundException,
  Req,
  Request,
  Res,
} from '@nestjs/common';
import Stripe from 'stripe';
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

  async cancelSubscription(userId: string) {
    const userDB = await this.userService.findOne(userId);

    if (!userDB.subscriptionId) {
      throw new NotFoundException('Usuario no tiene suscripción');
    }
    const subscription = await this.getSubscription(userDB.subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }
    await this.userService.setSubscription(null, null, userDB.email, null);
    await this.stripe.subscriptions.cancel(userDB.subscriptionId);
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
    let customer = user.customerId;
    if (!user.customerId) {
      customer = await this.stripe.customers
        .create({
          email: user.email,
        })
        .then((customer) => customer.id);
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer,
      line_items: [
        {
          quantity: 1,
          price: planId,
        },
      ],
      success_url: 'http://localhost:3000/stripe/success',
      cancel_url: 'http://localhost:3000/stripe/cancel',
    });

    // this.userService.setSubscription(session.id, customer, userId, planId);
    // Devolver la URL de la sesión de Checkout
    const sessionUrl = { url: session.url };

    // // Verificar el estado del pago en segundo plano
    // this.verifyPayment(session.id, customer, userId, planId);

    return sessionUrl;
  }

  async getPlan(planId: string) {
    const plan = await this.stripe.plans.retrieve(planId);
    return plan;
  }

  async getSubscription(subscriptionId: string) {
    const subscriptions = await this.stripe.subscriptions.list();
    const subscription = subscriptions.data.find(
      (sub) => sub.id === subscriptionId,
    );
    return subscription;
  }

  async getUserSubscription(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (!user.customerId || !user.subscriptionId || !user.planId) {
      throw new NotFoundException('Usuario no tiene suscripción');
    }
    return this.stripe.subscriptions.list({ customer: user.customerId });
  }

  async verifyPayment(
    subscriptionId: string,
    customerId: string,
    emailUser: string,
    planId: string,
  ) {
    this.userService.setSubscription(
      subscriptionId,
      customerId,
      emailUser,
      planId,
    );
  }
}

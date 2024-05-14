import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubDto } from './dto/CreateSub.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('/subscriptions')
@ApiTags('Subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  async getSubscriptions() {
    return this.subscriptionsService.getPlans();
  }

  @Post()
  async checkoutSubscription(@Body() subscription: CreateSubDto) {
    return this.subscriptionsService.checkoutSubscription(
      subscription.planId,
      subscription.userId,
    );
  }
}

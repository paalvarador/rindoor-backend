import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubDto } from './dto/CreateSub.dto';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { internalServerError } from 'src/utils/swagger.utils';
import {
  exampleCreatedSubscription,
  examplePlans,
  exampleUserOrPlanNotFound,
} from './swaggerExample/swagger.util';

@Controller('subscriptions')
@ApiTags('Subscripciones')
@ApiResponse(internalServerError)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiResponse({
    status: 200,
    description: 'Lista de planes',
    schema: {
      example: examplePlans,
    },
  })
  @ApiOperation({
    summary: 'Obtener planes',
    description: 'Obtener lista de planes',
  })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Crear link de subscripción',
    schema: {
      example: exampleCreatedSubscription,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Plan o Usuario no encontrado',
    schema: {
      example: exampleUserOrPlanNotFound,
    },
  })
  @ApiOperation({
    summary: 'Crear link de subscripción',
    description: 'Crear link de subscripción para el usuario',
  })
  async checkoutSubscription(@Body() subscription: CreateSubDto) {
    return this.subscriptionsService.checkoutSubscription(
      subscription.planId,
      subscription.userId,
    );
  }

  @Put('/cancel/:id')
  @ApiResponse({
    status: 200,
    description: 'Cancelar subscripción',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: exampleUserOrPlanNotFound[1],
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    required: true,
    schema: {
      type: 'string',
      format: 'uuid',
      example: 'c9bd9ea9-843a-4ed9-97de-af9d7387150e',
    },
  })
  @ApiOperation({
    summary: 'Cancelar subscripción',
    description: 'Cancelar subscripción del usuario',
  })
  async cancelSubscription(@Param('id', ParseUUIDPipe) userId: string) {
    this.subscriptionsService.cancelSubscription(userId);
    return;
  }

  @Get('/plans/:id')
  async getSubscription(@Param('id') id: string) {
    return this.subscriptionsService.getSubscription(id);
  }

  @Get('/user/:id')
  async getUserSubscription(@Param('id') id: string) {
    return this.subscriptionsService.getUserSubscription(id);
  }
}

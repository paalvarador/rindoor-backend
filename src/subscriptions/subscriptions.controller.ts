import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubDto } from './dto/CreateSub.dto';
import {
  ApiBearerAuth,
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
  exampleUserSubscriptions,
} from './swaggerExample/swagger.util';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/entities/Role.enum';
import { GuardToken } from 'src/guards/token.guard';
import { guardRoles } from 'src/guards/role.guard';

@Controller('subscriptions')
@ApiTags('Subscripciones')
@ApiResponse(internalServerError)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(GuardToken, guardRoles)
  @Get()
  async getAllSubscriptions() {
    return await this.subscriptionsService.getAllSubscriptions();
  }

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

  @ApiBearerAuth()
  @Roles(Role.PROFESSIONAL)
  @UseGuards(GuardToken, guardRoles)
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

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Subscripción',
    schema: {
      example: exampleUserSubscriptions[0],
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la subscripción',
    required: true,
    schema: {
      type: 'string',
      example: 'sub_1PHHOJCB2wIFzJhtbx6GqhLl',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Subscripción no encontrada',
    schema: {
      example: exampleUserOrPlanNotFound[0],
    },
  })
  @ApiOperation({
    summary: 'Obtener subscripción',
    description: 'Obtener subscripción por ID',
  })
  async getSubscription(@Param('id') id: string) {
    return this.subscriptionsService.getSubscription(id);
  }

  @Get('/user/:id')
  @ApiResponse({
    status: 200,
    description: 'Subscripciones del usuario',
    schema: {
      example: exampleUserSubscriptions,
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
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: exampleUserOrPlanNotFound[0],
    },
  })
  @ApiOperation({
    summary: 'Obtener subscripciones del usuario',
    description: 'Obtener lista de subscripciones del usuario',
  })
  async getUserSubscription(@Param('id') id: string) {
    return this.subscriptionsService.getUserSubscriptions(id);
  }
}

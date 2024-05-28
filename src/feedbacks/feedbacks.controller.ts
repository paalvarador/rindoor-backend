import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/entities/Role.enum';
import { guardRoles } from 'src/guards/role.guard';
import { GuardToken } from 'src/guards/token.guard';

@Controller('feedbacks')
@ApiTags('Feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @ApiBearerAuth()
  @Roles(Role.PROFESSIONAL, Role.CLIENT)
  @UseGuards(GuardToken, guardRoles)
  @Post(':id')
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Param('id', ParseUUIDPipe) receptorId: string,
  ) {
    return this.feedbacksService.create(createFeedbackDto, receptorId);
  }

  @Get()
  findAll() {
    return this.feedbacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.feedbacksService.findOne(id);
  }

  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.feedbacksService.remove(id);
  // }
}

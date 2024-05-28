import { Module } from '@nestjs/common';
import { UbicationController } from './ubication.controller';
import { UbicationService } from './ubication.service';

@Module({
  controllers: [],
  providers: [UbicationService],
})
export class UbicationModule {}

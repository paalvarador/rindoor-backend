import { Module } from "@nestjs/common";
import { UbicationController } from "./ubication.controller";
import { UbicationService } from "./ubication.service";

@Module({
  controllers: [UbicationController],
  providers: [UbicationService]
})
export class UbicationModule {}
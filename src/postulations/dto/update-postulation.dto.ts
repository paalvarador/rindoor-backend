import { PartialType } from '@nestjs/swagger';
import { CreatePostulationDto } from './create-postulation.dto';

export class UpdatePostulationDto extends PartialType(CreatePostulationDto) {}

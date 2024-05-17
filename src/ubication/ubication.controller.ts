import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import * as fs from 'fs';
import { CountrieDto } from './dto/countrie.dto';
import { UbicationService } from './ubication.service';

@Controller('ubications')
export class UbicationController {
  constructor(private readonly ubicationService: UbicationService) {}

  @Get('countries')
  async findAll() {
    const countries: any[] & CountrieDto[] = await JSON.parse(
      fs.readFileSync('src/ubication/data/countries.json', 'utf-8'),
    );
    return countries.map((country) => {
      return {
        id: country.id,
        name: country.name,
      };
    });
  }

  @Get('countries/:id/states')
  async findStatesByCountryId(@Param('id', ParseIntPipe) id: number) {
    const states: any[] = await JSON.parse(
      fs.readFileSync('src/ubication/data/states.json', 'utf-8'),
    );
    const statesToReturn = states
      .filter((state) => state.country_id === id)
      .map((state) => {
        return {
          id: state.id,
          name: state.name,
          country_id: state.country_id,
        };
      });
    return statesToReturn;
  }

  @Get('countries/:id')
  async getAllByCountryId(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_state') id_state: number,
  ) {
    try {
      return await this.ubicationService.getAllByCountryId(id, +id_state);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

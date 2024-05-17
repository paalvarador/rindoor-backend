import { Injectable } from '@nestjs/common';
import { CountrieDto } from './dto/countrie.dto';
import * as fs from 'fs';
import {
  getAllCountries,
  getStatesCountry,
  showUbication,
} from './utils/fsUtil.util';

@Injectable()
export class UbicationService {
  async findAll() {
    return getAllCountries();
  }

  async getAllByCountryId(id: number, id_state: number) {
    return showUbication(id, id_state);
  }

  async findStatesByCountryId(id: number) {
    return await getStatesCountry(id);
  }
}

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { City, Country, State } from 'country-state-city';
import { getStatesOfCountry } from 'country-state-city/lib/state';

export function IsValidCity(
  countryField: string,
  stateField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidCity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const country = Country.getAllCountries().find(
            (country) => country.name === args.object[countryField],
          );
          if (!country) {
            return false;
          }
          const state = State.getAllStates().find(
            (state) => state.name === args.object[stateField],
          );
          if (!state) {
            return false;
          }
          if (args.object[stateField].toLowerCase() === 'buenos aires') {
            const citiesOfBuenosAires = [
              'buenos aires',
              'la plata',
              'mar del plata',
              'san nicolas de los arroyos',
              'tandil',
              'zarate',
              'junin',
              'pilar',
              'san antonio de areco',
              'san pedro',
              'lobos',
              'mercedes',
              'chivilcoy',
              'tres arroyos',
              'campana',
              'san vicente',
            ];
            return citiesOfBuenosAires.includes(value.toLowerCase());
          }
          const cities = City.getCitiesOfState(
            country.isoCode,
            state.isoCode,
          ).map((city) =>
            city.name
              .toLowerCase()
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          );
          return cities.includes(value.toLowerCase().trim());
        },
      },
    });
  };
}

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { State, Country } from 'country-state-city';

export function IsValidProvince(
  countryField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidProvince',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const country = Country.getAllCountries().find(
            (country) => country.name === args.object[countryField],
          );
          const provinces = State.getStatesOfCountry(country.isoCode).map(
            (state) => state.name,
          );
          return provinces.includes(value);
        },
      },
    });
  };
}

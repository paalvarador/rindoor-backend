import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { Country } from 'country-state-city';

export function IsValidCountry(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidCountry',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const countries = Country.getAllCountries().map(
            (country) => country.name,
          );
          return countries.includes(value);
        },
      },
    });
  };
}

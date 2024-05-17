import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { getAllCountries } from 'src/ubication/utils/fsUtil.util';

export function IsValidCountry(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidCountry',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const countries = await getAllCountries();
          const idCountries = countries.map((country) => country.id);
          return idCountries.includes(value);
        },
      },
    });
  };
}

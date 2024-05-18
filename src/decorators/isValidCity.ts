import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { showUbication } from 'src/ubication/utils/fsUtil.util';

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
        async validate(value: any, args: ValidationArguments) {
          const state = await showUbication(
            args.object[countryField],
            args.object[stateField],
          );
          const citiesId = state.cities.map((city) => city.id);
          return citiesId.includes(value);
        },
      },
    });
  };
}

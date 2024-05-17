import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { State } from 'country-state-city';

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
          const country = (args.object as any)[countryField];
          const provinces = State.getStatesOfCountry(country).map(
            (state) => state.name,
          );
          return provinces.includes(value);
        },
      },
    });
  };
}

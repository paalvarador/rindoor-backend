import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { State, Country } from 'country-state-city';
import { getStatesCountry } from 'src/ubication/utils/fsUtil.util';

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
        async validate(value: any, args: ValidationArguments) {
          const country = args.object[countryField];
          const provincesIds = (await getStatesCountry(country)).map(
            (state) => state.id,
          );
          return provincesIds.includes(value);
        },
      },
    });
  };
}

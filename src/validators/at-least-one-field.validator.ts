import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function AtLeastOneField(propertyNames: string[], validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          return propertyNames.some(field => args.object[field] !== undefined && args.object[field] !== null);
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one of the following fields must be provided: ${propertyNames.join(', ')}`;
        }
      }
    });
  };
}

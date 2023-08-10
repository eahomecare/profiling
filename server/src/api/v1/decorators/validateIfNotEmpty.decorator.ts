import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function ValidateIfNotEmpty(properties: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'validateIfNotEmpty',
            target: object.constructor,
            propertyName: propertyName,
            constraints: properties,
            options: validationOptions,
            validator: {
                validate(_, args: ValidationArguments) {
                    const values = args.constraints.map(prop => (args.object as any)[prop]);
                    return values.some(val => val !== null && val !== undefined && val !== "");
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} is required if any of ${args.constraints.join(', ')} is provided.`;
                }
            }
        });
    };
}
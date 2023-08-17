import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsSubsetOfProperty(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isSubsetOfProperty',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any[], args: ValidationArguments) {
                    const relatedPropertyValues = (args.object as any)[args.constraints[0]];
                    return value.every(val => relatedPropertyValues.includes(val));
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} should be a subset of ${args.constraints[0]}`;
                }
            }
        });
    };
}
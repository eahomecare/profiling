import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'isPhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const re = /^\d{10}$/;
                    return typeof value === 'string' && re.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Mobile number should be a 10 digit number';
                },
            },
        });
    };
}
export function IsNumberStartingWith6789(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'isNumberStartingWith6789',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return value && typeof value === 'string' && ['6', '7', '8', '9'].includes(value[0]);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Mobile number should start with 6, 7, 8, or 9';
                },
            },
        });
    };
}
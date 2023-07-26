import { IsEmail, IsNotEmpty, IsNumberString, Matches, MinLength } from 'class-validator';

export class RegisterAgentDto {
    @IsNotEmpty({ message: "ID should not be blank" })
    ID: string;

    @IsNotEmpty({ message: "Name should not be blank" })
    @Matches(/^[a-zA-Z\s]*$/, { message: "Name should not have numbers" })
    name: string;

    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @IsNumberString({}, { message: "Mobile number should be digits only" })
    @Matches(/^[6-9]\d{9}$/, { message: "Mobile number should be a 10 digit number that starts with 6,7,8, or 9" })
    mobile: string;
}
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { IsPhoneNumber, IsNumberStartingWith6789 } from '../decorators/isPhoneNumber.decorator';

export class RegisterAgentDto {
    @IsNotEmpty({ message: "ID should not be blank" })
    ID: string;

    @IsNotEmpty({ message: "Name should not be blank" })
    @Matches(/^[a-zA-Z\s]*$/, { message: "Name should not have numbers" })
    name: string;

    @IsNotEmpty({ message: "Email should not be blank" })
    @IsEmail({}, { message: "Invalid email" })
    email: string;

    @IsNotEmpty({ message: "Mobile number should not be blank" })
    @IsNumberStartingWith6789({ message: "Mobile number should start with 6, 7, 8, or 9" })
    @IsPhoneNumber({ message: "Mobile number should be a 10 digit number" })
    mobile: string;
}
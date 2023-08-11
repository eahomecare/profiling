import { IsNotEmpty } from 'class-validator';
import { IsPhoneNumber, IsNumberStartingWith6789 } from '../decorators/isPhoneNumber.decorator';

export class KeywordsDto {
    @IsNotEmpty({ message: "Mobile number should not be blank" })
    @IsNumberStartingWith6789({ message: "Mobile number should start with 6, 7, 8, or 9" })
    @IsPhoneNumber({ message: "Mobile number should be a 10 digit number" })
    mobile: string;
}
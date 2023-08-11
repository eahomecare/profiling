import { IsArray, IsNotEmpty, ArrayNotEmpty, ValidateIf, Matches, IsOptional } from 'class-validator';
import { IsString, IsInt, } from 'class-validator';
import { IsPhoneNumber, IsNumberStartingWith6789 } from '../decorators/isPhoneNumber.decorator';
// import { Type } from 'class-transformer';
import { IsSubsetOfProperty } from '../decorators/isSubset.decorator';
// import { ValidateIfNotEmpty } from '../decorators/validateIfNotEmpty.decorator';

export class SubmitDataDto {
    @IsNotEmpty({ message: "Mobile number should not be blank" })
    @IsNumberStartingWith6789({ message: "Mobile number should start with 6, 7, 8, or 9" })
    @IsPhoneNumber({ message: "Mobile number should be a 10 digit number" })
    mobile: string;

    @IsOptional()
    selectedKeywords: string[];

    @IsOptional()
    remarks: string;

    @IsOptional()
    createdKeywords: string[];

    @IsOptional()
    questionResponses: QuestionResponseDto[];

}

export class QuestionResponseDto {
    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsInt()
    level: number;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsArray()
    options: string[];

    @IsSubsetOfProperty('options', { message: 'Selected options should be a subset of options' })
    @IsNotEmpty()
    @IsArray()
    selectedOptions: string[];
}
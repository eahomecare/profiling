import { IsArray, IsNotEmpty, ArrayNotEmpty, ValidateIf, Matches, IsOptional } from 'class-validator';
import { IsString, IsInt, } from 'class-validator';
import { IsPhoneNumber, IsNumberStartingWith6789 } from '../decorators/isPhoneNumber.decorator';
import { Type } from 'class-transformer';
import { IsSubsetOfProperty } from '../decorators/isSubset.decorator';
import { ValidateIfNotEmpty } from '../decorators/validateIfNotEmpty.decorator';

export class SubmitDataDto {

    @IsNotEmpty({ message: "Mobile number should not be blank" })
    @IsNumberStartingWith6789({ message: "Mobile number should start with 6, 7, 8, or 9" })
    @IsPhoneNumber({ message: "Mobile number should be a 10 digit number" })
    mobile: string;

    @ValidateIfNotEmpty(['remarks', 'createdKeywords', 'questionResponses'], { message: 'At least one of [remarks, createdKeywords, questionResponses] should be provided.' })
    @IsArray()
    @IsOptional()
    selectedKeywords: string[];

    @ValidateIfNotEmpty(['selectedKeywords', 'createdKeywords', 'questionResponses'], { message: 'At least one of [selectedKeywords, createdKeywords, questionResponses] should be provided.' })
    @IsString()
    @IsOptional()
    remarks: string;

    @ValidateIfNotEmpty(['selectedKeywords', 'remarks', 'questionResponses'], { message: 'At least one of [selectedKeywords, remarks, questionResponses] should be provided.' })
    @IsArray()
    @IsOptional()
    createdKeywords: string[];

    @ValidateIfNotEmpty(['selectedKeywords', 'remarks', 'createdKeywords'], { message: 'At least one of [selectedKeywords, remarks, createdKeywords] should be provided.' })
    @IsOptional()
    @Type(() => QuestionResponseDto) // Use the class-transformer to validate nested objects
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
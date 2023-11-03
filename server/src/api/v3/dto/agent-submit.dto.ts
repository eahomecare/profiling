import {
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { IsString, IsInt } from 'class-validator';
import { IsSubsetOfProperty } from '../decorators/isSubset.decorator';

export class SubmitDataDto {
  @IsNotEmpty({
    message: 'customerCRMId should not be blank',
  })
  customerCRMId: string | number;

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

  @IsSubsetOfProperty('options', {
    message:
      'Selected options should be a subset of options',
  })
  @IsNotEmpty()
  @IsArray()
  selectedOptions: string[];
}


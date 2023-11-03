import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CurrentKeywordsDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class QuestionDto {
  @IsNotEmpty({
    message: 'customerCRMId should not be blank',
  })
  customerCRMId: string | number;

  @IsNotEmpty()
  @IsNumber()
  questionNumber: number;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CurrentKeywordsDto)
  @IsOptional()
  currentKeywords?: CurrentKeywordsDto[];
}

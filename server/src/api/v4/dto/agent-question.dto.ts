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

  @IsOptional()
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

  @IsNotEmpty({
    message: 'questionNumber should not be blank',
  })
  @IsNumber()
  questionNumber: number;

  @IsNotEmpty({
    message: 'sessionId should not be blank',
  })
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsNumber()
  serviceId?: number;

  @IsOptional()
  @IsNumber()
  subServiceId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CurrentKeywordsDto)
  @IsOptional()
  currentKeywords?: CurrentKeywordsDto[];
}

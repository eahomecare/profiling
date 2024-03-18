import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class Widget2DistributionDto {
  @IsString()
  source: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  month?: string;
}

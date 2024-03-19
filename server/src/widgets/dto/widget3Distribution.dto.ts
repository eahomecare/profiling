import {
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';

export class Widget3DistributionDto {
  @IsString()
  source: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  month?: string;
}

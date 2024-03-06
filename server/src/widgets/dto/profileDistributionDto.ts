import {
  IsOptional,
  IsString,
} from 'class-validator';

export class ProfileDistributionDto {
  @IsString()
  @IsOptional()
  profileType?: string;

  @IsString()
  @IsOptional()
  demographic?: string;
}

import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProfileTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  srcUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

import {
  IsString,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class GlobalSearchDto {
  @IsString()
  searchTerm: string;

  @IsNumberString()
  @IsOptional()
  from?: number;

  @IsNumberString()
  @IsOptional()
  size?: number;
}

// column-search.dto.ts
export class ColumnSearchDto extends GlobalSearchDto {
  @IsString()
  field: string;
}

// compound-search.dto.ts

export class CompoundSearchDto {
  @IsOptional()
  @IsNumberString()
  from?: number;

  @IsOptional()
  @IsNumberString()
  size?: number;

  // Capture all other query parameters without specific validation
  [key: string]: any;
}

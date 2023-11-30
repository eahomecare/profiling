import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDto {
  @IsNotEmpty({
    message: 'The query field is required.',
  })
  @IsString({
    message: 'The query must be a string.',
  })
  query: string;

  @IsOptional()
  @IsString({
    message: 'The thread ID must be a string.',
  })
  threadId?: string;
}

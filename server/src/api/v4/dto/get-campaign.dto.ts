import {
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class GetCampaignsDto {
  @IsNotEmpty({
    message: 'customerCRMId should not be blank',
  })
  customerCRMId: string;

  @IsOptional()
  @IsArray({
    message: 'currentKeywords should be an array',
  })
  currentKeywords?: string[];
}

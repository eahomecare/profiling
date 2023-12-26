import {
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class GetCampaignsDto {
  @IsNotEmpty({
    message: 'customerCRMId should not be blank',
  })
  customerCRMId: string;

  @IsArray({
    message: 'currentKeywords should be an array',
  })
  currentKeywords?: string[];
}

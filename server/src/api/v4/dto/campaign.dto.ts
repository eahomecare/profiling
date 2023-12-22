import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CampaignDto {
  @IsNotEmpty({
    message: 'customerCRMId should not be blank',
  })
  customerCRMId: string;

  @IsNotEmpty({
    message: 'campaignId should not be blank',
  })
  @IsString({
    message: 'campaignId should be a string',
  })
  campaignId: string;

  @IsArray({
    message: 'modes should be an array',
  })
  @ArrayNotEmpty({
    message: 'modes should not be empty',
  })
  modes: ('WHATSAPP' | 'EMAIL' | 'SMS')[];
}

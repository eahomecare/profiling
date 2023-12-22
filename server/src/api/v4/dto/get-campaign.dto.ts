import { IsNotEmpty } from 'class-validator';

export class GetCampaignsDto {
  @IsNotEmpty({
    message: 'customerCRMId should not be blank',
  })
  customerCRMId: string;
}

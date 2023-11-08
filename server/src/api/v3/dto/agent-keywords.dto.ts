import { IsNotEmpty } from 'class-validator';

export class KeywordsDto {
  @IsNotEmpty({
    message: 'customerCRMId should not be blank',
  })
  customerCRMId: string | number;

  @IsNotEmpty({
    message: 'sessionId should not be blank',
  })
  sessionId: string;
}

import { IsNotEmpty } from 'class-validator';

export class ValidateAgentTokenDto {
    @IsNotEmpty()
    agentAuthorizationToken: string;
}
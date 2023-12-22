import { IsNotEmpty } from 'class-validator';

export class CreateAgentSessionDto {
    @IsNotEmpty()
    agentAuthenticationKey: string;
}
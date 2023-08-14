import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KeywordsService {
    constructor(private readonly prisma: PrismaService) { }

    async getKeywordsForMobile(mobile: string) {
        const customer = await this.prisma.customer.findUnique({
            where: { mobile: mobile },
            include: {
                keywords: {
                    select: {
                        id: true,
                        category: true,
                        value: true,
                        level: true,
                        customerIDs: false,
                        questionIDs: false,
                        profileTypeIDs: false
                    }
                }
            }
        });

        if (!customer) {
            throw new UnauthorizedException('No customer found with provided mobile number');
        }

        return {
            customerKeywords: customer.keywords
        };
    }
}
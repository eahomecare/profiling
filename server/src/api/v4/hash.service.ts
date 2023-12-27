import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.ts';

@Injectable()
export class HashService {
  private readonly logger = new Logger(
    HashService.name,
  );

  constructor(private prisma: PrismaService) {}

  async hashProcessing(
    customerID,
    selectedKeywords,
    createdKeywords,
  ) {
    let updatedCreatedKeywords = [
      ...createdKeywords,
    ];
    const hashKeywordsProcessed = [];

    for (const keyword of createdKeywords) {
      if (keyword.startsWith('#')) {
        const processed =
          await this.processPersonalDetails(
            keyword,
            customerID,
          );
        if (processed) {
          hashKeywordsProcessed.push(
            keyword.split('-')[0],
          );
          updatedCreatedKeywords =
            updatedCreatedKeywords.filter(
              (k) => k !== keyword,
            );
        }
      }
    }

    for (const hashKey of hashKeywordsProcessed) {
      let keywordID = await this.findKeywordID(
        hashKey,
      );
      if (!keywordID) {
        keywordID = await this.createKeyword(
          hashKey,
        );
      }
      if (!selectedKeywords.includes(keywordID)) {
        selectedKeywords.push(keywordID);
      }
    }

    return {
      selectedKeywords,
      updatedCreatedKeywords,
    };
  }

  private async findKeywordID(hashKey: string) {
    try {
      const keyword =
        await this.prisma.keyword.findFirst({
          where: {
            value: hashKey,
            category: 'personal',
          },
        });
      return keyword ? keyword.id : null;
    } catch (error) {
      this.logger.error(
        `Error finding keyword ID: ${error.message}`,
      );
      throw error;
    }
  }

  private async createKeyword(hashKey: string) {
    try {
      const newKeyword =
        await this.prisma.keyword.create({
          data: {
            value: hashKey,
            category: 'personal',
            level: 1,
          },
        });
      return newKeyword.id;
    } catch (error) {
      this.logger.error(
        `Error creating keyword: ${error.message}`,
      );
      throw error;
    }
  }

  private async processPersonalDetails(
    keyword: string,
    customerID: string,
  ) {
    const [hashKey, value] = keyword.split('-');
    const trimmedValue = value.trim();

    let fieldToUpdate = null;
    switch (hashKey) {
      case '#name':
        fieldToUpdate = {
          full_name: trimmedValue,
        };
        break;
      case '#dob':
        fieldToUpdate = {
          date_of_birth: new Date(trimmedValue),
        };
        break;
      case '#phone':
        fieldToUpdate = {
          phone_number: trimmedValue,
        };
        break;
      case '#email':
        fieldToUpdate = {
          email_address: trimmedValue,
        };
        break;
      case '#male':
      case '#female':
      case '#trans':
        fieldToUpdate = {
          gender: hashKey.substring(1),
        };
        break;
      default:
        return false;
    }

    await this.updatePersonalDetails(
      customerID,
      fieldToUpdate,
    );
    return true;
  }

  private async updatePersonalDetails(
    customerID: string,
    fieldToUpdate: any,
  ) {
    try {
      const customer =
        await this.prisma.customer.findUnique({
          where: { id: customerID },
          include: { personal_details: true },
        });

      if (
        !customer ||
        !customer.personal_details
      ) {
        this.logger.warn(
          'Customer or Personal Details not found',
        );
        return;
      }

      for (const field in fieldToUpdate) {
        if (customer.personal_details[field]) {
          delete fieldToUpdate[field];
        }
      }

      if (
        Object.keys(fieldToUpdate).length === 0
      ) {
        this.logger.warn('No fields to update');
        return;
      }

      await this.prisma.personal_Details.update({
        where: {
          id: customer.personal_details.id,
        },
        data: fieldToUpdate,
      });

      this.logger.log(
        'Personal Details updated successfully',
      );
    } catch (error) {
      this.logger.error(
        `Error updating personal details: ${error.message}`,
      );
      throw error;
    }
  }
}

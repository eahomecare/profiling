import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Personal_Details } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentKeywordsDto } from './dto/agent-question.dto';

@Injectable()
export class PersonaService {
  private readonly logger = new Logger(
    PersonaService.name,
  );
  private processedKeywordsSet: Set<string> =
    new Set();

  constructor(private prisma: PrismaService) {}

  async processPersonaKeywords(
    customerId: string,
    keywordIds: string[],
  ): Promise<string[]> {
    try {
      this.logger.log(
        `processPersonaKeywords entered, keywordIds are ${keywordIds}`,
      );
      const keywords =
        await this.prisma.keyword.findMany({
          where: {
            id: { in: keywordIds },
            category: 'persona',
          },
        });

      const personalDetails =
        await this.prisma.personal_Details.findUnique(
          {
            where: { customer_id: customerId },
          },
        );

      if (!personalDetails) {
        throw new NotFoundException(
          `Personal details not found for customer ID ${customerId}`,
        );
      }

      for (const keyword of keywords) {
        await this.updateCustomerPersonalDetails(
          personalDetails,
          keyword,
        );
      }

      this.logger.log(
        'Processed persona keywords successfully',
      );
      return keywordIds.filter(
        (id) =>
          !keywords.some((kw) => kw.id === id),
      );
    } catch (error) {
      this.logger.error(
        `Error processing persona keywords: ${error.message}`,
      );
      throw new InternalServerErrorException(
        error.message,
      );
    }
  }

  private async updateCustomerPersonalDetails(
    personalDetails: any,
    keyword: { value: string; category: string },
  ) {
    const personalDetailUpdates =
      this.mapKeywordToPersonalDetails(
        personalDetails,
        keyword,
      );

    if (personalDetailUpdates) {
      await this.prisma.personal_Details.update({
        where: {
          customer_id:
            personalDetails.customer_id,
        },
        data: personalDetailUpdates,
      });
    }
  }

  private mapKeywordToPersonalDetails(
    personalDetails: any,
    keyword: { value: string; category: string },
  ): Partial<Personal_Details> | null {
    if (
      keyword.category === 'persona' &&
      this.isEligibleForUpdate(
        personalDetails.gender,
        ['male', 'female', 'trans'],
        keyword.value,
      )
    ) {
      return { gender: keyword.value };
    }

    return null;
  }

  private isEligibleForUpdate(
    currentValue: string | null,
    validValues: string[],
    newValue: string,
  ): boolean {
    return (
      !validValues.includes(
        currentValue?.toLowerCase(),
      ) ||
      currentValue === null ||
      currentValue === ''
    );
  }

  async processCreatedKeywords(
    customerId: string,
    currentKeywords: string[],
  ): Promise<string[]> {
    this.logger.debug(
      `processCreatedKeywords entered, currentKeywords are ${currentKeywords}`,
    );
    try {
      const personalDetails =
        await this.prisma.personal_Details.findUnique(
          {
            where: { customer_id: customerId },
          },
        );

      this.logger.debug(
        `Personal Details before are ${JSON.stringify(
          personalDetails,
        )}`,
      );

      if (!personalDetails) {
        throw new NotFoundException(
          `Personal details not found for customer ID ${customerId}`,
        );
      }

      this.processedKeywordsSet.clear();
      for (const keyword of currentKeywords) {
        const [key, value] =
          this.parseKeyword(keyword);
        if (key && value) {
          await this.updateCreatedKeywordPersonalDetails(
            personalDetails,
            key,
            value,
            keyword,
          );
        }
      }

      this.logger.debug(
        `Personal Details after are ${JSON.stringify(
          personalDetails,
        )}`,
      );

      this.logger.log(
        'Processed created keywords successfully',
      );
      return currentKeywords.filter(
        (keyword) =>
          !this.isProcessedKeyword(keyword),
      );
    } catch (error) {
      this.logger.error(
        `Error processing created keywords: ${error.message}`,
      );
      throw new InternalServerErrorException(
        error.message,
      );
    }
  }

  private parseKeyword(
    keyword: string,
  ): [string, string] {
    const parts = keyword
      .split('-')
      .map((part) => part.trim());
    this.logger.debug(
      `Parsing keyword: ${keyword}, Result: ${parts.join(
        ', ',
      )}`,
    );
    return parts.length === 2
      ? [parts[0], parts[1]]
      : [null, null];
  }

  private async updateCreatedKeywordPersonalDetails(
    personalDetails: any,
    key: string,
    value: string,
    originalKeyword: string,
  ) {
    const updates =
      this.mapCreatedKeywordToPersonalDetails(
        personalDetails,
        key,
        value,
      );

    if (updates) {
      this.logger.debug(
        `Updating personal details for key: ${key}, value: ${value}`,
      );
      await this.prisma.personal_Details.update({
        where: {
          customer_id:
            personalDetails.customer_id,
        },
        data: updates,
      });
      this.processedKeywordsSet.add(
        originalKeyword,
      );
      this.logger.debug(
        `Updated personal details for ${originalKeyword}`,
      );
    } else {
      this.logger.debug(
        `No update required for ${originalKeyword}`,
      );
    }
  }

  private mapCreatedKeywordToPersonalDetails(
    personalDetails: any,
    key: string,
    value: string,
  ): Partial<Personal_Details> | null {
    this.logger.debug(
      `Mapping created keyword to personal details: key=${key}, value=${value}`,
    );
    switch (key) {
      case 'dob':
        if (
          this.isValueEmpty(
            personalDetails.date_of_birth,
          )
        ) {
          const dateParts = value
            .split('/')
            .map((part) => parseInt(part, 10));
          if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            const parsedDate = new Date(
              year,
              month - 1,
              day,
            );
            return { date_of_birth: parsedDate };
          } else {
            this.logger.warn(
              `Invalid date format for dob: ${value}`,
            );
            return null;
          }
        }
        break;
      case 'name':
        if (
          this.isValueEmpty(
            personalDetails.full_name,
          )
        ) {
          return { full_name: value };
        }
        break;
      case 'email':
        if (
          this.isValueEmpty(
            personalDetails.email_address,
          )
        ) {
          return { email_address: value };
        }
        break;
      case 'phone':
        if (
          this.isValueEmpty(
            personalDetails.phone_number,
          )
        ) {
          return { phone_number: value };
        }
        break;
      // Other cases ...
    }

    this.logger.debug(
      `No mapping found for key: ${key}`,
    );
    return null;
  }

  private isValueEmpty(
    value: string | null,
  ): boolean {
    const isEmpty = !value || value.trim() === '';
    this.logger.debug(
      `Checking if value is empty: '${value}', Result: ${isEmpty}`,
    );
    return isEmpty;
  }

  private isProcessedKeyword(
    keyword: string,
  ): boolean {
    const isProcessed =
      this.processedKeywordsSet.has(keyword);
    this.logger.debug(
      `Checking if keyword is processed: ${keyword}, Result: ${isProcessed}`,
    );
    return isProcessed;
  }

  //simulations for questions api
  async simulateKeywordProcessing(
    customerId: string,
    currentKeywords: CurrentKeywordsDto[],
  ): Promise<CurrentKeywordsDto[]> {
    this.logger.log(
      `Simulating keyword processing for customer ID: ${customerId}`,
    );

    try {
      const remainingKeywords = await Promise.all(
        [
          this.simulateProcessPersonaKeywords(
            customerId,
            currentKeywords,
          ),
          this.simulateProcessCreatedKeywords(
            customerId,
            currentKeywords,
          ),
        ],
      );

      const combinedRemainingKeywords =
        remainingKeywords[0].concat(
          remainingKeywords[1],
        );
      this.logger.log(
        'Completed simulating keyword processing',
      );
      return combinedRemainingKeywords;
    } catch (error) {
      this.logger.error(
        `Error in simulating keyword processing: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Error in simulating keyword processing: ${error.message}`,
      );
    }
  }

  private async simulateProcessPersonaKeywords(
    customerId: string,
    currentKeywords: CurrentKeywordsDto[],
  ): Promise<CurrentKeywordsDto[]> {
    this.logger.log(
      'Simulating process for persona keywords',
    );

    const keywordIds = currentKeywords
      .filter((kw) => kw.id)
      .map((kw) => kw.id);
    const keywords =
      await this.prisma.keyword.findMany({
        where: {
          id: { in: keywordIds },
          category: 'persona',
        },
      });

    const personalDetails =
      await this.prisma.personal_Details.findUnique(
        {
          where: { customer_id: customerId },
        },
      );

    if (!personalDetails) {
      this.logger.error(
        `Personal details not found for customer ID ${customerId}`,
      );
      return currentKeywords;
    }

    const processedKeywordIds = new Set(
      keywords
        .filter((keyword) =>
          this.mapKeywordToPersonalDetails(
            personalDetails,
            keyword,
          ),
        )
        .map((kw) => kw.id),
    );

    return currentKeywords.filter(
      (kw) => !processedKeywordIds.has(kw.id),
    );
  }

  private async simulateProcessCreatedKeywords(
    customerId: string,
    currentKeywords: CurrentKeywordsDto[],
  ): Promise<CurrentKeywordsDto[]> {
    this.logger.log(
      'Simulating process for created keywords',
    );

    const personalDetails =
      await this.prisma.personal_Details.findUnique(
        {
          where: { customer_id: customerId },
        },
      );

    if (!personalDetails) {
      this.logger.error(
        `Personal details not found for customer ID ${customerId}`,
      );
      return currentKeywords;
    }

    let tempTrackerId = 0;
    const keywordsWithTracker =
      currentKeywords.map((kw) => ({
        ...kw,
        tempTrackerId: kw.id
          ? null
          : tempTrackerId++,
      }));

    const processedTrackerIds = new Set(
      keywordsWithTracker
        .filter((kw) => !kw.id)
        .filter((kw) => {
          const [key, val] = this.parseKeyword(
            kw.value,
          );
          return (
            key &&
            val &&
            this.mapCreatedKeywordToPersonalDetails(
              personalDetails,
              key,
              val,
            )
          );
        })
        .map((kw) => kw.tempTrackerId),
    );

    return keywordsWithTracker
      .filter(
        (kw) =>
          !processedTrackerIds.has(
            kw.tempTrackerId,
          ),
      )
      .map((kw) => {
        const { tempTrackerId, ...rest } = kw;
        return rest;
      });
  }
}

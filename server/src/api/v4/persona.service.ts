import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Personal_Details } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import Filter = require('bad-words');
import { CurrentKeywordsDto } from './dto/agent-question.dto';

@Injectable()
export class PersonaService {
  private readonly logger = new Logger(
    PersonaService.name,
  );
  private processedKeywordsSet: Set<string> =
    new Set();
  private filter: Filter;

  constructor(private prisma: PrismaService) {
    this.filter = new Filter();
  }

  async processPersonaKeywords(
    customerId: string,
    keywordIds: string[],
  ): Promise<[string[], string[]]> {
    this.logger.log(
      `processPersonaKeywords entered, keywordIds are ${keywordIds}`,
    );
    try {
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

      const processedKeywordIds = [];
      const keywordsToCreate = [];
      for (const keyword of keywords) {
        const updateResult =
          await this.processKeywordForPersonalDetails(
            personalDetails,
            keyword,
          );
        if (updateResult) {
          processedKeywordIds.push(keyword.id);
        } else {
          keywordsToCreate.push(keyword.value);
        }
      }

      this.logger.log(
        'Processed persona keywords successfully',
      );
      return [
        keywordIds.filter(
          (id) =>
            !processedKeywordIds.includes(id),
        ),
        keywordsToCreate,
      ];
    } catch (error) {
      this.logger.error(
        `Error processing persona keywords: ${error.message}`,
      );
      throw new InternalServerErrorException(
        error.message,
      );
    }
  }

  private async processKeywordForPersonalDetails(
    personalDetails: Personal_Details,
    keyword: { value: string; category: string },
  ): Promise<boolean> {
    this.logger.log(
      `Processing keyword for personal details: ${JSON.stringify(
        keyword,
      )}`,
    );
    const bracketValue =
      keyword.value.match(/\((.*?)\)/)?.[1];
    const pureValue = keyword.value.replace(
      /\s*\(.*?\)\s*/,
      '',
    );

    switch (bracketValue) {
      case 'current location':
        return await this.updateFieldIfEmpty(
          personalDetails,
          'current_address',
          pureValue,
        );
      case 'travel destination':
        return await this.updateFieldIfEmpty(
          personalDetails,
          'travel_address',
          pureValue,
        );
      case 'home address':
        return await this.updateFieldIfEmpty(
          personalDetails,
          'address',
          pureValue,
        );
      default:
        const updates =
          this.mapKeywordToPersonalDetails(
            personalDetails,
            keyword,
          );
        if (updates) {
          await this.prisma.personal_Details.update(
            {
              where: {
                customer_id:
                  personalDetails.customer_id,
              },
              data: updates,
            },
          );
          return true;
        }
        return false;
    }
  }

  private async updateFieldIfEmpty(
    personalDetails: Personal_Details,
    field: string,
    value: string,
  ): Promise<boolean> {
    if (
      this.isValueEmpty(personalDetails[field])
    ) {
      await this.prisma.personal_Details.update({
        where: {
          customer_id:
            personalDetails.customer_id,
        },
        data: { [field]: value },
      });
      return true;
    }
    return false;
  }

  private mapKeywordToPersonalDetails(
    personalDetails: Personal_Details,
    keyword: { value: string; category: string },
  ): Partial<Personal_Details> | null {
    this.logger.log(
      `Mapping keyword to personal details: ${JSON.stringify(
        keyword,
      )}`,
    );
    if (keyword.category !== 'persona') {
      this.logger.debug(
        `Skipping non-persona keyword: ${keyword.value}`,
      );
      return null;
    }

    const genderValues = [
      'male',
      'female',
      'trans',
    ];
    if (
      genderValues.includes(keyword.value) ||
      this.isGenderFieldEligibleForUpdate(
        personalDetails.gender,
      )
    ) {
      this.logger.debug(
        `Updating gender field with value: ${keyword.value}`,
      );
      return { gender: keyword.value };
    } else {
      this.logger.debug(
        `Gender value ${keyword.value} is not eligible for update.`,
      );
    }

    return null;
  }

  private isGenderFieldEligibleForUpdate(
    currentGender: string | null,
  ): boolean {
    this.logger.log(
      `Checking if gender field is eligible for update. Current value: ${currentGender}`,
    );
    return (
      !currentGender ||
      currentGender.trim() === '' ||
      currentGender === 'other'
    );
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

  async processCreatedKeywords(
    customerId: string,
    currentKeywords: string[],
  ): Promise<string[]> {
    this.logger.debug(
      `processCreatedKeywords entered, currentKeywords are ${currentKeywords}`,
    );
    try {
      const cleanedKeywords =
        currentKeywords.filter(
          (keyword) =>
            !this.filter.isProfane(keyword),
        );

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

      this.processedKeywordsSet.clear();
      for (const keyword of cleanedKeywords) {
        const [key, value] =
          this.parseKeyword(keyword);
        if (
          key &&
          value &&
          typeof value === 'string'
        ) {
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
    const firstDashIndex = keyword.indexOf('-');
    if (firstDashIndex === -1) {
      return [null, null];
    }

    const key = keyword
      .substring(0, firstDashIndex)
      .trim();
    const value = keyword
      .substring(firstDashIndex + 1)
      .trim();
    return [key, value];
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
    key = key.trim();
    value = value.trim();
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
      case 'ann':
        if (
          this.isValueEmpty(
            personalDetails.anniversary,
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
            return { anniversary: parsedDate };
          } else {
            this.logger.warn(
              `Invalid date format for ann: ${value}`,
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
      case 'current':
        return { current_address: value };
      case 'travel':
        return { travel_address: value };
      case 'marital':
        return { marital_status: value };
      case 'emp':
        return { employment: value };
      case 'home':
        if (
          this.isValueEmpty(
            personalDetails.address,
          )
        ) {
          return { address: value };
        }
        break;
    }

    this.logger.debug(
      `No mapping found for key: ${key}`,
    );
    return null;
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

import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextService {
  identifyContext(
    term: string,
  ): 'date' | 'other' | 'general' {
    if (this.isDateContext(term)) {
      return 'date';
    }
    return 'general';
  }

  private isDateContext(term: string): boolean {
    const parts = term.split('/');
    if (parts.length < 2) {
      return false;
    }

    const day = parts[0].padStart(2, '0');
    const month =
      parts.length > 1
        ? parts[1].padStart(2, '0')
        : '';
    const year =
      parts.length === 3 ? parts[2] : '';

    const formattedTerm =
      parts.length === 2
        ? `${day}/${month}`
        : `${day}/${month}/${year}`;

    const dateRegex =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])(\/\d{0,4})?$/;
    if (!dateRegex.test(formattedTerm)) {
      return false;
    }

    if (year.length === 4) {
      return this.isValidDate(
        parseInt(day, 10),
        parseInt(month, 10),
        parseInt(year, 10),
      );
    }

    return day.length === 2 && month.length === 2;
  }

  private isValidDate(
    day: number,
    month: number,
    year: number,
  ): boolean {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }

  generateDateSuggestions(
    term: string,
  ): string[] {
    const suggestions = [];
    const dateParts = term.split('/');

    if (
      dateParts.length === 2 ||
      dateParts.length === 3
    ) {
      const day = dateParts[0].padStart(2, '0');
      const month = dateParts[1].padStart(2, '0');
      const year =
        dateParts.length === 3
          ? dateParts[2]
          : '';

      if (year.length < 4) {
        suggestions.push(
          ...this.generateYearSuggestions(
            day,
            month,
            year,
          ),
        );
      } else {
        suggestions.push(
          `dob-${day}/${month}/${year}`,
        );
        suggestions.push(
          `ann-${day}/${month}/${year}`,
        );
      }
    }

    return suggestions;
  }

  private generateYearSuggestions(
    day: string,
    month: string,
    partialYear: string,
  ): string[] {
    const currentYear = new Date().getFullYear();
    const suggestions = [];

    if (partialYear.length === 0) {
      for (
        let year = currentYear - 10;
        year <= currentYear;
        year++
      ) {
        suggestions.push(
          `dob-${day}/${month}/${year}`,
        );
        suggestions.push(
          `ann-${day}/${month}/${year}`,
        );
      }
    } else if (partialYear.length <= 2) {
      this.addDecadesSuggestionsForPartialYear(
        partialYear,
        day,
        month,
        suggestions,
        currentYear,
      );
    } else {
      // Handle 3 and 4 digit years
      const year = partialYear.padStart(4, '20');
      suggestions.push(
        `dob-${day}/${month}/${year}`,
      );
      suggestions.push(
        `ann-${day}/${month}/${year}`,
      );
    }

    return suggestions;
  }

  private addDecadesSuggestionsForPartialYear(
    partialYear: string,
    day: string,
    month: string,
    suggestions: string[],
    currentYear: number,
  ) {
    const partialYearNum = parseInt(
      partialYear,
      10,
    );

    // Handle two-digit year entries
    if (partialYear.length === 2) {
      this.addSuggestionsForTwoDigitYear(
        partialYearNum,
        day,
        month,
        suggestions,
        currentYear,
      );
    }

    // Handle three-digit year entries
    if (partialYear.length === 3) {
      const startDecade =
        Math.floor(partialYearNum / 100) * 100;
      for (
        let year = currentYear;
        year >= startDecade;
        year--
      ) {
        if (
          year.toString().startsWith(partialYear)
        ) {
          this.addYearSuggestions(
            day,
            month,
            year,
            suggestions,
          );
        }
      }
    }
  }

  private addSuggestionsForTwoDigitYear(
    partialYearNum: number,
    day: string,
    month: string,
    suggestions: string[],
    currentYear: number,
  ) {
    for (
      let year = currentYear;
      year >= 1900;
      year -= 100
    ) {
      if (year % 100 === partialYearNum) {
        this.addYearSuggestions(
          day,
          month,
          year,
          suggestions,
        );
      }
    }
  }

  private addYearSuggestions(
    day: string,
    month: string,
    year: number,
    suggestions: string[],
  ) {
    suggestions.push(
      `dob-${day}/${month}/${year}`,
    );
    suggestions.push(
      `ann-${day}/${month}/${year}`,
    );
  }
}

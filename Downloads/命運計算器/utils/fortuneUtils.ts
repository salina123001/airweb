import { UserInput, CalculationResults } from '../types';
// Use ASTROLOGY_SIGNS for logic, ASTROLOGY_SIGNS_DATA for richer data if needed elsewhere
import { ORDERED_CHINESE_ZODIAC_SIGNS, ASTROLOGY_SIGNS } from '../constants';

const calculateChineseZodiac = (year: number): string => {
  const referenceYear = 1924; 
  if (year < referenceYear) { 
    return ORDERED_CHINESE_ZODIAC_SIGNS[((year - referenceYear) % 12 + 12) % 12];
  }
  return ORDERED_CHINESE_ZODIAC_SIGNS[(year - referenceYear) % 12];
};

const calculateAstrologySign = (month: number, day: number): string => {
  const capricorn = ASTROLOGY_SIGNS.find(sign => sign.name === "摩羯座");
  if (capricorn && ((month === capricorn.startMonth && day >= capricorn.startDay) || (month === capricorn.endMonth && day <= capricorn.endDay))) {
    return capricorn.name;
  }

  for (const sign of ASTROLOGY_SIGNS) {
    if (sign.name === "摩羯座") continue;

    // Check if the date falls within the sign's period
    // Case 1: Sign does not cross year boundary (e.g., Aries: Mar 21 - Apr 19)
    if (sign.startMonth < sign.endMonth) {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay) ||
          (month > sign.startMonth && month < sign.endMonth)) {
        return sign.name;
      }
    } 
    // This logic was slightly flawed for signs like Capricorn that span Dec-Jan.
    // The initial Capricorn check handles this. For other signs, the simple conditions should work.
    // The previous complex condition was:
    // if (sign.startMonth < sign.endMonth && month > sign.startMonth && month < sign.endMonth)
    // This only checks for full months between start and end, not the start/end months themselves.
    // Corrected logic is incorporated into the if-block:
    // (month === sign.startMonth && day >= sign.startDay)
    // (month === sign.endMonth && day <= sign.endDay)
    // (month > sign.startMonth && month < sign.endMonth) -> for signs spanning multiple full months
  }
  return "未知星座"; 
};

const sumDigits = (numStr: string): number => {
  let sum = 0;
  for (const char of numStr) {
    sum += parseInt(char, 10);
  }
  return sum;
};

const reduceToSingleDigit = (num: number): number => {
  let currentNum = num;
  while (currentNum > 9) {
    currentNum = sumDigits(currentNum.toString());
  }
  return currentNum;
};

const calculateLifePathNumber = (birthDate: string): number => { 
  const [yearStr, monthStr, dayStr] = birthDate.split('-');
  
  const yearSum = reduceToSingleDigit(sumDigits(yearStr));
  const monthSum = reduceToSingleDigit(sumDigits(monthStr));
  const daySum = reduceToSingleDigit(sumDigits(dayStr));
  
  let totalSum = yearSum + monthSum + daySum;
  return reduceToSingleDigit(totalSum);
};

export const calculateFortuneDetails = (userInput: UserInput): CalculationResults => {
  // Ensure birthDate is a valid string for Date constructor.
  // The input type="date" should provide "YYYY-MM-DD"
  const dateParts = userInput.birthDate.split('-');
  if (dateParts.length !== 3) {
      throw new Error("無效的出生日期格式。請使用 YYYY-MM-DD。");
  }
  
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10); // 1-12
  const day = parseInt(dateParts[2], 10); // 1-31

  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error("無效的出生日期。請檢查年月日是否正確。");
  }
  // Further date validation (e.g., Feb 30) could be added here if necessary,
  // but standard date objects handle this implicitly.
  // const date = new Date(year, month - 1, day); // month is 0-indexed for JS Date
  // if (date.getFullYear() !== year || date.getMonth() !== month -1 || date.getDate() !== day) {
  //   throw new Error("無效的出生日期 (例如：2月30日)。");
  // }


  return {
    chineseZodiac: calculateChineseZodiac(year),
    astrologySign: calculateAstrologySign(month, day),
    lifePathNumber: calculateLifePathNumber(userInput.birthDate),
  };
};
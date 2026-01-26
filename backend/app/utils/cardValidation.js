// utils/cardValidation.js
export const isValidLuhn = (numStr) => {
  let sum = 0;
  let shouldDouble = false;

  for (let i = numStr.length - 1; i >= 0; i--) {
    let digit = Number(numStr[i]);
    if (Number.isNaN(digit)) return false;

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const isCardNotExpired = (expMonth, expYear) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  if (expYear > y) return true;
  if (expYear === y && expMonth >= m) return true;
  return false;
};

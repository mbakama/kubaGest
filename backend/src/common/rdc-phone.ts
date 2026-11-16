const TEN_DIGIT_PREFIXES = [
  '080',
  '081',
  '082',
  '083',
  '084',
  '085',
  '089',
  '097',
  '098',
  '099',
  '091',
  '090',
];

const THIRTEEN_DIGIT_PREFIXES = TEN_DIGIT_PREFIXES.map((p) => `+243${p.slice(1)}`);

export function formatTelephoneWithCountryCode(
  telephone: unknown,
  codeTelephonique = '+243',
): string | null {
  let phone = String(telephone ?? '').replace(/\s+/g, '').trim();
  if (!phone) {
    return null;
  }

  if (phone.startsWith('+')) {
    const digits = phone.slice(1).replace(/\D/g, '');
    return digits ? `+${digits}` : null;
  }

  let dial = String(codeTelephonique).replace(/\s+/g, '').trim();
  if (dial && !dial.startsWith('+')) {
    dial = `+${dial}`;
  }

  const dialDigits = dial.replace(/^\+/, '');
  let national = phone;
  if (national.startsWith(dialDigits)) {
    national = national.slice(dialDigits.length);
  }
  if (national.startsWith('0')) {
    national = national.slice(1);
  }
  national = national.replace(/\D/g, '');
  if (!national) {
    return null;
  }
  return `${dial}${national}`;
}

export function isValidRdcPhone(value: string): boolean {
  const cleanValue = value.replace(/\s+/g, '');

  if (cleanValue.startsWith('0')) {
    if (cleanValue.length !== 10) {
      return false;
    }
    const tenDigitRegex = new RegExp(
      `^(${TEN_DIGIT_PREFIXES.join('|')})\\d{7}$`,
    );
    return tenDigitRegex.test(cleanValue);
  }

  if (cleanValue.startsWith('+')) {
    if (cleanValue.length !== 13) {
      return false;
    }
    const escaped = THIRTEEN_DIGIT_PREFIXES.map((p) =>
      p.replace(/\+/g, '\\+'),
    );
    const thirteenDigitRegex = new RegExp(
      `^(?:${escaped.join('|')})\\d{7}$`,
    );
    return thirteenDigitRegex.test(cleanValue);
  }

  return false;
}

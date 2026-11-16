/** Indicatif RDC (aligné eRecettes / contribuable-new). */
export const RDC_DIAL = '+243';
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
/** Normalise pour l’API : `081 453 25 55` → `+243814532555`. */
export function formatTelephoneWithCountryCode(telephone, codeTelephonique = RDC_DIAL) {
    let phone = String(telephone ?? '').replace(/\s+/g, '').trim();
    if (!phone || phone === '----') {
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
    if (!dial) {
        dial = RDC_DIAL;
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
/** Règles RDC (contribuable-new `validateTelephone`). */
export function validateRdcPhoneValue(value) {
    if (!value || !String(value).trim()) {
        return null;
    }
    const cleanValue = String(value).replace(/\s+/g, '');
    if (cleanValue.startsWith('0')) {
        if (cleanValue.length < 10) {
            return { incompleteTenDigit: true };
        }
        if (cleanValue.length > 10) {
            return { tooLong: true };
        }
        const tenDigitRegex = new RegExp(`^(${TEN_DIGIT_PREFIXES.join('|')})\\d{7}$`);
        if (!tenDigitRegex.test(cleanValue)) {
            return { invalidTenDigit: true };
        }
        return null;
    }
    if (cleanValue.startsWith('+')) {
        if (cleanValue.length < 13) {
            return { incompleteThirteenDigit: true };
        }
        if (cleanValue.length > 13) {
            return { tooLong: true };
        }
        const escaped = THIRTEEN_DIGIT_PREFIXES.map((p) => p.replace(/\+/g, '\\+'));
        const thirteenDigitRegex = new RegExp(`^(?:${escaped.join('|')})\\d{7}$`);
        if (thirteenDigitRegex.test(cleanValue)) {
            return null;
        }
    }
    if (cleanValue.length > 0 &&
        !cleanValue.startsWith('0') &&
        !cleanValue.startsWith('+')) {
        return { invalidStart: true };
    }
    if (cleanValue === '0' || cleanValue === '+') {
        return { incompleteNumber: true };
    }
    return { invalidTelephone: true };
}
export function rdcPhoneValidator() {
    return (control) => validateRdcPhoneValue(control.value);
}
const LOCAL_GROUP_SIZES = [2, 3, 2, 2];
/** Affichage saisie : `814532555` → `81 453 25 55`. */
export function formatRdcPhoneLocalDisplay(formValue, dial = RDC_DIAL) {
    const value = String(formValue ?? '').trim();
    if (!value) {
        return '';
    }
    let local = value.startsWith(dial)
        ? value.slice(dial.length).trim()
        : value.startsWith('0')
            ? value.slice(1)
            : value;
    local = local.replace(/[^0-9+\s]/g, '');
    const digits = local.replace(/\s/g, '');
    if (!/^\d*$/.test(digits)) {
        return local;
    }
    const groups = [];
    let start = 0;
    for (const size of LOCAL_GROUP_SIZES) {
        if (start >= digits.length) {
            break;
        }
        groups.push(digits.slice(start, start + size));
        start += size;
    }
    if (start < digits.length) {
        groups.push(...(digits.slice(start).match(/.{1,3}/g) ?? []));
    }
    return groups.join(' ');
}
/** Met à jour la valeur du formulaire depuis la saisie (indicatif séparé). */
export function rdcPhoneValueFromInput(rawInput, dial = RDC_DIAL) {
    let local = rawInput.replace(/[^0-9+\s]/g, '');
    if (local.startsWith(dial)) {
        local = local.slice(dial.length).trim();
    }
    if (/^0\d/.test(local.replace(/\s/g, ''))) {
        local = local.replace(/^0/, '');
    }
    if (!local.trim()) {
        return '';
    }
    if (local.startsWith('+')) {
        return local.replace(/\s+/g, ' ').trim();
    }
    return `${dial} ${local}`.trim();
}
export function rdcPhoneErrorMessage(errors) {
    if (!errors) {
        return null;
    }
    if (errors['incompleteTenDigit']) {
        return 'Numéro national incomplet (10 chiffres attendus).';
    }
    if (errors['incompleteThirteenDigit']) {
        return 'Numéro international incomplet (indicatif +243 inclus).';
    }
    if (errors['invalidTenDigit']) {
        return 'Préfixe ou format national invalide (ex. 081, 082, 097…).';
    }
    if (errors['invalidStart']) {
        return 'Le numéro doit commencer par 0 ou +243.';
    }
    if (errors['tooLong']) {
        return 'Le numéro de téléphone est trop long.';
    }
    if (errors['incompleteNumber']) {
        return 'Numéro incomplet.';
    }
    if (errors['invalidTelephone']) {
        return 'Numéro de téléphone invalide.';
    }
    return 'Numéro de téléphone invalide.';
}

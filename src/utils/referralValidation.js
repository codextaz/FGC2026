/**
 * Validates an EcoCash payment reference / approval code.
 *
 * Real EcoCash approval codes follow the pattern:
 *   MP<YYMMDD>.<HHMM>.<SUFFIX>
 *   e.g. MP260722.1402.A12345
 *
 * We do two levels of checks:
 *   1. Strict format: must match the MP…  pattern exactly (preferred)
 *   2. Relaxed format: must be alphanumeric (with common separators),
 *      include both letters AND digits, not look obviously fake, and
 *      not be a duplicate.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Normalize a raw input string for comparison / pattern testing. */
function normalize(raw) {
  return String(raw || '').trim().replace(/\s+/g, '').toUpperCase();
}

/** True if every character in the string is the same (e.g. "AAAAAA"). */
function isAllSameChar(str) {
  return str.length > 1 && /^(.)\1+$/.test(str);
}

/** True if the string contains only sequentially increasing digits (e.g. "123456"). */
function isSequentialDigits(str) {
  const digits = str.replace(/[^0-9]/g, '');
  if (digits.length < 4) return false;
  for (let i = 1; i < digits.length; i++) {
    if (Number(digits[i]) !== Number(digits[i - 1]) + 1) return false;
  }
  return true;
}

/** True if the string contains a suspiciously repetitive block (4+ repeated chars). */
function hasRepetitiveBlock(str) {
  return /(.)\1{3,}/.test(str);
}

// ─── Fake / placeholder keyword list ─────────────────────────────────────────

const FAKE_KEYWORDS = [
  'TEST', 'FAKE', 'DEMO', 'DUMMY', 'EXAMPLE', 'PLACEHOLDER', 'REFERENCE',
  'SAMPLE', 'TRIAL', 'VOID', 'INVALID', 'NULL', 'NONE', 'NA', 'N/A',
  'ABCDEF', 'ABCABC', 'AAAAAA', 'ZZZZZZ', '000000', '111111', '123456',
  'QWERTY', 'ASDFGH', 'RANDOM', 'TEMP', 'TMP', 'XXXX', 'YYYY', 'ZZZZ',
  'TESTING', 'FAKEREF', 'TESTREF', 'DEMOREF', 'NOTREAL', 'MADE UP',
];

// ─── The real EcoCash format pattern ─────────────────────────────────────────
// Matches: MP<YYMMDD>.<HHMM>.<1+ alphanumeric chars>
// Examples: MP260722.1402.A12345   MP260801.0900.B99999
const ECOCASH_FORMAT_RE = /^MP\d{6}\.\d{4}\.[A-Z0-9]+$/;

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * @param {string} rawValue    – Raw string the user typed.
 * @param {string[]} existingRefs – Already-registered references (from all players).
 * @returns {{ isValid: boolean, normalizedValue: string, error: string }}
 */
export function validateEcoRef(rawValue, existingRefs = []) {
  const normalizedValue = normalize(rawValue);

  // 1. Must not be empty
  if (!normalizedValue) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Please enter the EcoCash approval code / reference ID.',
    };
  }

  // 2. Minimum length (EcoCash codes are at least 10 chars)
  if (normalizedValue.length < 10) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Reference code is too short. Use the full EcoCash approval code (e.g. MP260722.1402.A12345).',
    };
  }

  // 3. No fake / placeholder keywords
  const hasKeyword = FAKE_KEYWORDS.some((kw) => normalize(kw) !== '' && normalizedValue.includes(normalize(kw)));
  if (hasKeyword) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Please use a real EcoCash reference code from the SMS confirmation.',
    };
  }

  // 4. No all-same-character strings (e.g. "AAAAAAAAAA")
  if (isAllSameChar(normalizedValue.replace(/[^A-Z0-9]/g, ''))) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Reference code looks invalid. Please copy the code exactly from your EcoCash SMS.',
    };
  }

  // 5. No repetitive blocks of 4+ identical characters in a row
  if (hasRepetitiveBlock(normalizedValue)) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Reference code appears to contain repeated characters. Use the exact code from your SMS.',
    };
  }

  // 6. No purely sequential digit runs (e.g. "1234567890")
  const alphanumOnly = normalizedValue.replace(/[^A-Z0-9]/g, '');
  if (isSequentialDigits(alphanumOnly)) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Reference code looks like a placeholder. Please use the actual EcoCash approval code.',
    };
  }

  // 7. Allowed characters only: letters, digits, dots, hyphens, slashes, underscores
  if (!/^[A-Z0-9._/\-]+$/.test(normalizedValue)) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Reference code contains invalid characters. Only letters, digits, dots, dashes, and slashes are allowed.',
    };
  }

  // 8. Must contain BOTH letters and digits
  if (!/[A-Z]/.test(normalizedValue) || !/\d/.test(normalizedValue)) {
    return {
      isValid: false,
      normalizedValue,
      error: 'Reference code must include both letters and numbers (e.g. MP260722.1402.A12345).',
    };
  }

  // 9. Strongly prefer the real EcoCash format — warn if it doesn't match
  if (!ECOCASH_FORMAT_RE.test(normalizedValue)) {
    return {
      isValid: false,
      normalizedValue,
      error:
        'Reference code does not match the EcoCash format. It should look like: MP260722.1402.A12345 — check your SMS confirmation.',
    };
  }

  // 10. Duplicate check — no two registrations may share the same reference
  const isDuplicate = existingRefs.some(
    (ref) => normalize(ref) === normalizedValue
  );
  if (isDuplicate) {
    return {
      isValid: false,
      normalizedValue,
      error: 'This EcoCash reference code has already been used. Each registration requires a unique payment code.',
    };
  }

  // ✅ All checks passed
  return {
    isValid: true,
    normalizedValue,
    error: '',
  };
}

/**
 * Check for duplicate gamer tags (case-insensitive) across existing players.
 * @param {string} gamerTag
 * @param {{ gamerTag: string }[]} existingPlayers
 * @returns {{ isDuplicate: boolean, error: string }}
 */
export function checkDuplicateGamerTag(gamerTag, existingPlayers = []) {
  const normalized = normalize(gamerTag);
  if (!normalized) return { isDuplicate: false, error: '' };

  const isDuplicate = existingPlayers.some(
    (p) => normalize(p.gamerTag) === normalized
  );

  return {
    isDuplicate,
    error: isDuplicate
      ? `The gamer tag "${gamerTag.trim()}" is already registered. Please choose a different handle.`
      : '',
  };
}

/**
 * Check for duplicate phone numbers across existing players.
 * Strips all non-digit characters before comparing.
 * @param {string} phone
 * @param {{ phone: string }[]} existingPlayers
 * @returns {{ isDuplicate: boolean, error: string }}
 */
export function checkDuplicatePhone(phone, existingPlayers = []) {
  const stripped = String(phone || '').replace(/\D/g, '');
  if (stripped.length < 7) return { isDuplicate: false, error: '' };

  const isDuplicate = existingPlayers.some(
    (p) => String(p.phone || '').replace(/\D/g, '') === stripped
  );

  return {
    isDuplicate,
    error: isDuplicate
      ? 'This phone number is already registered. Each player must use a unique phone number.'
      : '',
  };
}

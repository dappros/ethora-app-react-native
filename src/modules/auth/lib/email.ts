/**
 * Spaces and invisible characters that come along with a copied email:
 * regular whitespace (incl. no-break space, newlines) and zero-width ones,
 * which `trim()` leaves in place. An email can't contain any of them.
 */
const EMAIL_JUNK = /[\s​-‍⁠﻿]/g;

/**
 * Email as the server expects it. The server compares emails as-is (a space
 * gives 422, a different case gives 401), so only the junk is removed;
 * the case is kept, as in the web app.
 */
export const normalizeEmail = (value: string): string => (value ?? '').replace(EMAIL_JUNK, '');

const EMAIL_SHAPE = /^[^@]+@[^@]+\.[^@]+$/;

/** react-hook-form `validate` for email fields: checks the normalized value. */
export const validateEmail = (value: string): true | string =>
  EMAIL_SHAPE.test(normalizeEmail(value)) || 'Invalid email';

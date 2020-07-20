import validator from 'validator';

/**
 * check if begin with 'https:', 'mailto:', 'tel:'.
 *
 * @param {string} path
 * @returns {Boolean}
 */
export function isBeginWith(path) {
  return validator.matches(path, /^(https?:|mailto:|tel:)/);
}

/**
 * check if the string is an URL.
 *
 * @param {string} url
 * @returns {Boolean}
 */
export function isURL(url) {
  return validator.isURL(url);
}

/**
 * check if the string is lowercase.
 *
 * @param {string} str
 * @returns {Boolean}
 */
export function isLowerCase(str) {
  return validator.isLowercase(str);
}

/**
 * check if the string is uppercase.
 *
 * @param {string} str
 * @returns {Boolean}
 */
export function isUppercase(str) {
  return validator.isUppercase(str);
}

/**
 * check if the string contains only letters (a-zA-Z).
 *
 * @param {string} str
 * @returns {Boolean}
 */
export function isAlpha(str) {
  return validator.isAlpha(str);
}

/**
 * check if the string is an email.
 *
 * @param {string} email
 * @returns {Boolean}
 */
export function isEmail(email) {
  return validator.isEmail(email);
}

/**
 * check if the string is String type.
 * .
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String;
}

/**
 * check if the arguments is Array.
 *
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

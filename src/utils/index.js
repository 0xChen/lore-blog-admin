import lodashCloneDeep from 'lodash.clonedeep';
import lodashDebounce from 'lodash.debounce';
import lodashGet from 'lodash.get';

/**
 * get the byte length of an utf8 string
 *
 * @param {string} str
 * @returns {number} length
 */
export function byteLength(str) {
  let sl = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      sl++;
    } else if (code > 0x7ff && code <= 0xffff) {
      sl += 2;
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
      i--;
    }
  }
  return sl;
}

/**
 * lodash.cloneDeep
 *
 * @param {*} target
 * @return {*}
 */
export function cloneDeep(target) {
  return lodashCloneDeep(target);
}

/**
 * lodash.debounce
 *
 * @param {Function} func
 * @param {number} wait
 * @param {Object} options
 * @return {debounced}
 */
export function debounce(func, wait, options) {
  return lodashDebounce(func, wait, options);
}

/**
 * lodash.debounce
 *
 * @param {Object} object
 * @param {Array|string} path
 * @param {*} defaultValue
 * @return {*}
 */
export function get(object, path, defaultValue) {
  return lodashGet(object, path, defaultValue);
}

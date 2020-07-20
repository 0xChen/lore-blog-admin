import { title } from '@/settings';

const trim = string => (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');

export function getPageTitle(pageTitle) {
  return pageTitle ? `${pageTitle} - ${title}` : `${title}`;
}

function position() {
  return document.documentElement.scrollTop
    || document.body.parentNode.scrollTop
    || document.body.scrollTop;
}

/**
 * scrollTop animation
 *
 * @param {number} to
 * @param {number} duration
 * @param {Function} endCallback
 * @param {number} from
 * @param {Window|Object} el
 */
export function scrollTop(to, duration = 500, endCallback, from = position(), el = window) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.msRequestAnimationFrame
      || (callback => {
        window.setTimeout(callback, 1000 / 60);
      })
    );
  }

  const difference = Math.abs(from - to);
  const stepValue = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) {
      if (endCallback && typeof (endCallback) === 'function') {
        endCallback();
      }
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, stepValue);
}

/**
 * @param {string} url
 * @param {string} windowTitle
 * @param {number} w
 * @param {number} h
 */
export function openWindow(url, windowTitle, w, h) {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top;

  let { width } = window.screen;
  if (window.innerWidth) {
    width = window.innerWidth;
  } else if (document.documentElement.clientWidth) {
    width = document.documentElement.clientWidth;
  }

  let { height } = window.screen;
  if (window.innerHeight) {
    height = window.innerHeight;
  } else if (document.documentElement.clientHeight) {
    height = document.documentElement.clientHeight;
  }

  const left = ((width / 2) - (w / 2)) + dualScreenLeft;
  const top = ((height / 2) - (h / 2)) + dualScreenTop;
  const newWindow = window.open(url, windowTitle, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`);

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url = window.location.href) {
  const search = url.substring(url.lastIndexOf('?') + 1);
  const object = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    object[name] = String(decodeURIComponent($2));
    return rs;
  });
  return object;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += ` ${className}`;
  } else {
    classString = classString.substr(0, nameIndex)
      + classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  if (!ele || !cls) {
    return false;
  }
  if (cls.includes(' ')) {
    throw new Error('className should not contain space.');
  }
  if (ele.classList) {
    return ele.classList.contains(cls);
  }
  return (` ${ele.className} `).includes(` ${cls} `);
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!ele) {
    return;
  }
  let curClass = ele.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }

    if (ele.classList) {
      ele.classList.add(clsName);
    } else if (!hasClass(ele, clsName)) {
      curClass += ` ${clsName}`;
    }
  }
  if (!ele.classList) {
    ele.className = curClass;
  }
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (!ele || !cls) {
    return;
  }
  const classes = cls.split(' ');
  let curClass = ` ${ele.className} `;

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }

    if (ele.classList) {
      ele.classList.remove(clsName);
    } else if (hasClass(ele, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ');
    }
  }
  if (!ele.classList) {
    ele.className = trim(curClass);
  }
}

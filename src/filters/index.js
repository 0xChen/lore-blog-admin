import moment from '@/utils/date';

export { relativeTime } from '@/utils/date';

/**
 * 文件 size 格式化
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function fileSizeFormat(num, digits) {
  const si = [
    {
      value: 1E18,
      symbol: 'E'
    },
    {
      value: 1E15,
      symbol: 'P'
    },
    {
      value: 1E12,
      symbol: 'T'
    },
    {
      value: 1E9,
      symbol: 'G'
    },
    {
      value: 1E6,
      symbol: 'M'
    },
    {
      value: 1E3,
      symbol: 'k'
    }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits)
        .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

/**
 * 首字母大写
 *
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function timeFormat(dataStr, pattern = 'YYYY-MM-DDTHH:mm:ss') {
  return moment(dataStr).format(pattern);
}

export function dateFormat(dataStr) {
  return timeFormat(dataStr, 'YYYY-MM-DD');
}

import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
moment.defaultFormat = 'YYYY-MM-DDTHH:mm:ss';

/**
 * @param {number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {boolean}
 */
const isMillisecond = timeStamp => /^\d{13}$/.test(String(timeStamp));

/**
 * @param {string|number} timeStamp 时间戳
 * @returns {string} 相对时间字符串
 */
export function relativeTime(timeStamp) {
  // 如果是毫秒格式则转为秒格式
  if (isMillisecond(timeStamp)) {
    Math.floor(timeStamp /= 1000);
  }
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp);
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date().toString()) / 1000);
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = timeStamp < currentTime;
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp;
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) {
    diff = -diff;
  }
  let result;
  const dirStr = IS_EARLY ? '前' : '后';
  // 少于等于59秒
  if (diff <= 59) {
    result = `${diff}秒${dirStr}`;
  } else if (diff > 59 && diff <= 3599) {
    // 多于59秒，少于等于59分钟59秒
    result = `${Math.floor(diff / 60)}分钟${dirStr}`;
  } else if (diff > 3599 && diff <= 86399) {
    // 多于59分钟59秒，少于等于23小时59分钟59秒
    result = `${Math.floor(diff / 3600)}小时${dirStr}`;
  } else if (diff > 86399 && diff <= 2623859) {
    // 多于23小时59分钟59秒，少于等于29天59分钟59秒
    result = `${Math.floor(diff / 86400)}天${dirStr}`;
  } else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) {
    // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
    result = moment(timeStamp).format('MM-DD HH:mm');
  } else {
    result = moment(timeStamp).format('YYYY-MM-DD HH:mm');
  }
  return result;
}

export default moment;

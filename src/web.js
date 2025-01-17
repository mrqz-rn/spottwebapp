import { WebPlugin } from '@capacitor/core';

/**
 * @typedef {Object} BooleanResult
 * @property {boolean} value
 */

/**
 * @implements {DatetimeSettingPlugin}
 */
export class DatetimeSettingWeb extends WebPlugin {
  async isAutoTimeEnabled() {
    // console.warn('isAutoTimeEnabled is not available on web');
    return { value: false };
  }

  async isAutoTimeZoneEnabled() {
    // console.warn('isAutoTimeZoneEnabled is not available on web');
    return { value: false };
  }
}

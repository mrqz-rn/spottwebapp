/**
 * @typedef {Object} BooleanResult
 * @property {boolean} value
 */

/**
 * @interface DatetimeSettingPlugin
 */

/**
 * @returns {Promise<BooleanResult>}
 */
DatetimeSettingPlugin.prototype.isAutoTimeEnabled = function() {
    // Implementation here
  };
  
  /**
   * @returns {Promise<BooleanResult>}
   */
  DatetimeSettingPlugin.prototype.isAutoTimeZoneEnabled = function() {
    // Implementation here
  };
  
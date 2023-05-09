/**
 * Checks if the given text is within the specified maxLength.
 *
 * @param {string} text The text to check.
 * @param {number} [maxLength=255] The maximum allowed length of the text. Default is 255.
 * @returns {boolean} True if the text is within the limit, false otherwise.
 */
function textLimitCheck(text, maxLength = 255) {
  return text.length <= maxLength;
}

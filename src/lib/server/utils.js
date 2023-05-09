export const maxTitleExcerptLength = 55;
export const maxExcerptLength = 100;

/**
 * Truncates a title to the specified length, adding an ellipsis if necessary.
 * This shouldn't be used on the actual post title, but rather on the title displayed in the post list.
 * 
 * @param {string} title The title to truncate.
 * @returns {string} The truncated title.
 */
export function truncateTitle(title) {
  return title.length > maxTitleExcerptLength ? title.substring(0, maxTitleExcerptLength) + '…' : title;
}

/**
 * Truncates a post's content to the specified length, adding an ellipsis if necessary.
 * 
 * @param {string} content The content of the post to truncate.
 * @returns {string} The truncated content.
 */
export function truncateExcerpt(content) {
  return content.length > maxExcerptLength ? content.substring(0, maxExcerptLength) + '…' : content;
}

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

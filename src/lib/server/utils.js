import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import crypto from 'crypto';

export const maxTitleExcerptLength = 55;
export const maxExcerptLength = 55; // Was 150 characters, now 55 words as rec'd by Wordpress

/**
 * Get the currently configured name of the site.
 * 
 * @returns {string} The currently configured site name.
 */
export function getSiteName() {
  //TODO: Get this from the DB?
  return 'dss-blog';
}

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
 * @param {Object} [options] The options to use when truncating the content.
 * @param {number} [options.limit] The maximum length of the excerpt.
 * @param {boolean} [options.byWords] Whether to truncate by words instead of characters.
 * @returns {string} The truncated content.
 */
export function truncateExcerpt(content, { limit = maxExcerptLength, byWords = false }={}) {
  // TODO: this should probably still cap to a certain character length
  if (byWords) return truncateStringToWordCount(content, limit);

  return content.length > limit ? content.substring(0, limit) + '…' : content;
}

/**
 * Truncate a string to the specified number of words.
 * 
 * @param {string} inputString The string to truncate.
 * @param {number} wordCount The number of words to truncate to.
 * @returns 
 */
export function truncateStringToWordCount(inputString, wordCount) {
  const words = inputString.split(' ');

  if (words.length <= wordCount) return inputString;

  return words.slice(0, wordCount).join(' ') + '…';
}

/**
 * Checks if the given text is within the specified maxLength.
 *
 * @param {string} text The text to check.
 * @param {number} [maxLength=255] The maximum allowed length of the text. Default is 255.
 * @returns {boolean} True if the text is within the limit, false otherwise.
 */
export function textLimitCheck(text, maxLength = 255) {
  return text.length <= maxLength;
}

/**
 * Creates a URL-friendly slug from the given title.
 *
 * @param {string} title - The title to be converted into a slug.
 * @returns {string} The generated slug.
 */
export function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

/**
 * Sanitize unsafe html to prevent XSS attacks.
 * 
 * @param {string} html The html to sanitize.
 * @returns {string} The sanitized html.
 */
export function sanitizeHTML(html) {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  return purify.sanitize(html);
}


/**
 * Sanitizes the input to prevent SQL injection and ensures the input meets basic requirements.
 * @param {string} input The input string to sanitize.
 * @param {number} [maxLength] The maximum allowed length of the input string.
 * @returns {string} The sanitized input.
 */
export function dataSanitizeAndCheck(input, maxLength) {
  if (input === null || input === undefined || input.trim() === '') {
    throw new Error('Input must not be null, undefined, or empty');
  }

  if (maxLength && input.length > maxLength) {
    throw new Error(`Input length must not exceed ${maxLength} characters`);
  }

  const escapeCharacters = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;'
  };

  return input.replace(/[&<>"'`/]/g, (char) => escapeCharacters[char]);
}

/**
 * Strips the markdown from a string, outputting plain text.
 * 
 * @param {string} markdown The input string containing markdown to be stripped.
 * @returns {string} The plain text output.
 * @see https://stackoverflow.com/a/74977142
 */
export function mdToPlaintext(markdown) {
  // Replace bold or italic text with plain text
  markdown = markdown.replace(/\*{1,2}(.+?)\*{1,2}/gm, '');
  markdown = markdown.replace(/\_{1,2}(.+?)\_{1,2}/gm, '');

  // Replace strikethrough text with plain text
  markdown = markdown.replace(/~~(.+?)~~/gm, '');

  // Replace inline code with plain text
  markdown = markdown.replace(/`(.+?)`/gm, '');

  // Replace codeblocks with plain text
  markdown = markdown.replace(/```(.+?)```/gm, '');

  // Remove images
  markdown = markdown.replace(/!\[(.+?)\]\(.+?\)/gm, '');

  // Replace links with plain text
  markdown = markdown.replace(/\[(.+?)\]\(.+?\)/gm, '$1');

  // Replace headings with plain text
  markdown = markdown.replace(/#{1,6}\s+(.+?)\s*$/gm, '$1');
  markdown = markdown.replace(/={3,}/gm, '');
  markdown = markdown.replace(/-{3,}/gm, '');

  // Remove blockquotes
  markdown = markdown.replace(/^\s*>\s+(.+?)\s*$/gm, '');

  // Remove lists
  markdown = markdown.replace(/^\s*[\*\-+]\s+(.+?)\s*$/gm, '');

  // Remove horizontal rules
  markdown = markdown.replace(/^\s*[\*\-+]\s*$/gm, '');

  return markdown;
}

/**
 * Generates a Gravatar URL based on the provided email address.
 *
 * @param {string} email - The email address to generate the Gravatar URL for.
 * @returns {string} The generated Gravatar URL.
 */
export function gravatar(email) {
  // TODO: for demo purposes, specific override for my email
  if (email === 'jack.dssblog@mawersoft.co.uk') email = 'jack@mawersoft.co.uk';

  // Use crypto module to hash email and return gravatar url
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=retro`;
}

/**
 * Creates a custom error object with the provided status code and message.
 *
 * @param {number} status - The HTTP status code for the error.
 * @param {string} message - A description of the error.
 * @returns {Error} - A custom error object with the status code and message.
 */
export function error(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

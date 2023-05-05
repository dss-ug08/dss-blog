/**
 * Creates a URL-friendly slug from the given title.
 *
 * @param {string} title - The title to be converted into a slug.
 * @returns {string} The generated slug.
 */
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

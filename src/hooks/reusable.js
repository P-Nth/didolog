/**
 * Converts a given string to sentence case.
 * - Capitalizes the first character.
 * - Converts the rest of the string to lowercase.
 *
 * @param {string} text - The text to convert.
 * @returns {string} The sentence-cased string.
 */
export function toSentenceCase(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitalizes the first letter of each word in a sentence.
 *
 * @param {string} text - The sentence to capitalize.
 * @returns {string} - The sentence with each word capitalized.
 */
export function capitalizeWords(text) {
  if (!text) return '';

  return text
    .toLowerCase() // Convert entire string to lowercase first
    .split(' ')     // Split by spaces into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(' ');     // Rejoin into a sentence
}


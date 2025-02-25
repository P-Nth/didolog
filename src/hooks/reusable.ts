/**
 * Converts a given string to sentence case.
 * - Capitalizes the first character.
 * - Converts the rest of the string to lowercase.
 *
 * @param text - The text to convert.
 * @returns The sentence-cased string.
 */
export function toSentenceCase(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitalizes the first letter of each word in a sentence.
 *
 * @param text - The sentence to capitalize.
 * @returns The sentence with each word capitalized.
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';

  return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

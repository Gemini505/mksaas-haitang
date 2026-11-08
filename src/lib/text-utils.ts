/**
 * Convert text to HTML format
 * @param text Original text
 * @returns Converted HTML string
 */
export function textToHtml(text: string): string {
  if (!text) return '';

  return (
    text
      // Remove existing HTML tags first
      .replace(/<[^>]*>?/g, '')
      // Escape HTML special characters
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      // Handle line breaks
      .replace(/\r\n/g, '<br/>') // Windows line breaks
      .replace(/\n/g, '<br/>') // Unix/Linux line breaks
      .replace(/\r/g, '<br/>') // Old Mac line breaks
      // Handle tab characters
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      // Handle multiple consecutive spaces
      .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length))
      // Handle full-width spaces
      .replace(/　/g, '&nbsp;&nbsp;')
      // Handle other common special characters
      .replace(/\u00A0/g, '&nbsp;') // Non-breaking space
      .replace(/\u2002/g, '&nbsp;') // En space
      .replace(/\u2003/g, '&nbsp;&nbsp;') // Em space
      .replace(/\u2009/g, '&nbsp;') // Thin space
      .replace(/\u200B/g, '') // Zero width space
      .replace(/\u200C/g, '') // Zero width non-joiner
      .replace(/\u200D/g, '') // Zero width joiner
      .replace(/\uFEFF/g, '') // Zero width no-break space
  );
}

/**
 * Convert HTML to plain text
 * @param html HTML string
 * @returns Plain text string
 */
export function htmlToText(html: string): string {
  if (!html) return '';

  return (
    html
      // First convert <br/> tags to line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Remove all HTML tags
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Clean up excess whitespace
      .replace(/\n\s*\n/g, '\n\n') // Merge multiple consecutive line breaks into two
      .trim()
  );
}

/**
 * Truncate text, add ellipsis if exceeds maximum length
 * @param text Original text
 * @param maxLength Maximum length
 * @param suffix Suffix, defaults to '...'
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix = '...'
): string {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Clean special characters and excess whitespace from text
 * @param text Original text
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  if (!text) return '';

  return (
    text
      // Remove zero-width characters
      .replace(/\u200B/g, '') // Zero width space
      .replace(/\u200C/g, '') // Zero width non-joiner
      .replace(/\u200D/g, '') // Zero width joiner
      .replace(/\uFEFF/g, '') // Zero width no-break space
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Clean up excess whitespace
      .replace(/[ \t]+/g, ' ') // Merge multiple spaces/tabs into one space
      .replace(/\n\s*\n/g, '\n\n') // Merge multiple consecutive line breaks into two
      .trim()
  );
}

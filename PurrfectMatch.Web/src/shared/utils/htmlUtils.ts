/**
 * Utility functions for handling HTML content
 */

/**
 * Decodes HTML entities in a string
 * @param html - The HTML string with entities to decode
 * @returns String with HTML entities decoded
 */
export const decodeHtmlEntities = (html: string): string => {
  if (!html) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * Sanitizes and decodes HTML content for safe display
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // First decode any HTML entities
  let sanitized = html;
  
  // Replace common problematic characters and entities
  sanitized = sanitized
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    // Handle any remaining numeric entities
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Remove null characters and other problematic characters
    .replace(/\0/g, '')
    .replace(/\uFFFD/g, ''); // Remove replacement characters (???)
  
  return sanitized;
};

/**
 * Strips HTML tags from a string and returns plain text
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  // First sanitize the HTML
  const sanitized = sanitizeHtml(html);
  
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitized;
  
  // Get text content and clean up extra whitespace
  const text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Clean up extra whitespace and replace question marks that might be encoding issues
  return text
    .replace(/\s+/g, ' ')
    .replace(/\?{2,}/g, '') // Remove multiple question marks that indicate encoding issues
    .trim();
};

/**
 * Strips HTML tags and truncates text to specified length
 * @param html - The HTML string to process
 * @param maxLength - Maximum length of the returned string
 * @param ellipsis - Whether to add '...' at the end if truncated
 * @returns Plain text truncated to maxLength
 */
export const stripAndTruncateHtml = (
  html: string, 
  maxLength: number = 150, 
  ellipsis: boolean = true
): string => {
  const plainText = stripHtmlTags(html);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  return ellipsis ? truncated + '...' : truncated;
};

/**
 * Strips HTML tags and preserves basic formatting with line breaks
 * @param html - The HTML string to process
 * @returns Plain text with preserved line breaks
 */
export const stripHtmlPreserveLineBreaks = (html: string): string => {
  if (!html) return '';
  
  // First sanitize the HTML
  const sanitized = sanitizeHtml(html);
  
  // Replace common block elements with line breaks
  let text = sanitized
    .replace(/<\/?(p|div|br|h[1-6])[^>]*>/gi, '\n')
    .replace(/<\/?(ul|ol|li)[^>]*>/gi, '\n')
    .replace(/<\/?(blockquote)[^>]*>/gi, '\n\n');
  
  // Remove all remaining HTML tags
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Clean up multiple consecutive line breaks and encoding issues
  text = text
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\?{2,}/g, '') // Remove multiple question marks
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  // Trim leading/trailing whitespace
  return text.trim();
};

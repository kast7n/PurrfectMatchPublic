/**
 * Utility functions for text and content processing
 */

/**
 * Strips HTML tags and decodes HTML entities from a string
 * @param html - The HTML string to clean
 * @returns Plain text content without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div element to decode HTML entities and strip tags
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get the text content which automatically strips HTML tags
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // Clean up any extra whitespace and return
  return textContent.replace(/\s+/g, ' ').trim();
};

/**
 * Truncates text content to a specified length and adds ellipsis
 * @param content - The content to truncate
 * @param maxLength - Maximum length before truncation (default: 150)
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (content: string, maxLength: number = 150): string => {
  const cleanContent = stripHtmlTags(content);
  
  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength) + '...';
};

/**
 * Formats a date string into a human-readable format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Extracts a preview of content from HTML, removing tags and limiting length
 * @param htmlContent - HTML content string
 * @param maxLength - Maximum length for preview (default: 200)
 * @returns Preview text
 */
export const getContentPreview = (htmlContent: string, maxLength: number = 200): string => {
  return truncateText(htmlContent, maxLength);
};

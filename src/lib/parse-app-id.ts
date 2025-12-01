/**
 * Extracts an App Store ID from a URL or returns the input if it's already an ID.
 *
 * Handles URLs like:
 * - https://apps.apple.com/app/id6743941366
 * - https://apps.apple.com/app/id6743941366?foo=bar
 * - https://apps.apple.com/us/app/some-app-name/id6743941366
 * - https://apps.apple.com/app/some-app-name/id6743941366?mt=8
 */
export function parseAppleAppId(input: string): string {
  const trimmed = input.trim();

  // If it's already just a numeric ID, return it
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  // Try to extract ID from App Store URL
  // Pattern: /id followed by digits
  const match = trimmed.match(/\/id(\d+)/);
  if (match) {
    return match[1];
  }

  // Return original input if no ID found (let validation handle it)
  return trimmed;
}

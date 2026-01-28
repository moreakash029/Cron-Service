
export const API_VERSION_REGEX = /\/v(\d+)\//; // Regex to match /v1/, /v2/ etc.

/**
 * Extracts the API version number from a URL string.
 * Expected format: /v1/..., /v2/...
 * @param url The URL path to extract version from
 * @param defaultVersion Fallback version if no match found
 * @returns The version string (e.g. "1")
 */
export function extractVersionFromUrl(url: string, defaultVersion = '1'): string {
    if (!url) {
        return defaultVersion;
    }
    const match = url.match(API_VERSION_REGEX);
    return (match && match[1]) ? match[1] : defaultVersion;
}

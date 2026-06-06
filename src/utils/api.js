

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const API_TIMEOUT = 5000; // ms
const GITHUB_API_URL = 'https://api.github.com';

export class APIError extends Error {
    constructor(message, statusCode, originalError) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.originalError = originalError;
    }
}

const fetchWithTimeout = (url, timeout = API_TIMEOUT) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('API request timeout')), timeout)
        ),
    ]);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchGitHubRepos = async (username, retries = MAX_RETRIES) => {
    try {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetchWithTimeout(
                    `${GITHUB_API_URL}/users/${username}/repos?per_page=100&sort=updated`,
                    API_TIMEOUT
                );

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new APIError(
                            'GitHub API rate limit exceeded. Please try again later.',
                            response.status,
                            new Error('Rate Limited')
                        );
                    }

                    if (response.status === 404) {
                        throw new APIError(
                            'GitHub user not found',
                            response.status,
                            new Error('Not Found')
                        );
                    }

                    throw new APIError(
                        `GitHub API error: ${response.statusText}`,
                        response.status,
                        new Error(response.statusText)
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new APIError(
                        'Invalid API response format',
                        500,
                        new Error('Invalid Response Format')
                    );
                }

                return data;
            } catch (error) {
                if (attempt < retries - 1) {
                    const waitTime = RETRY_DELAY * Math.pow(2, attempt); // Exponential backoff
                    await delay(waitTime);
                    continue;
                }

                if (error instanceof APIError) {
                    throw error;
                }

                throw new APIError(
                    'Failed to fetch GitHub repositories. Please check your connection.',
                    0,
                    error
                );
            }
        }
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(
            'An unexpected error occurred',
            0,
            error
        );
    }
};

export default {
    fetchGitHubRepos,
    APIError,
};

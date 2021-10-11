let accessToken: string | undefined;

/**
 * Sets the access token to the supplied value and persists it in local storage.
 * @param accessToken The new access token.
 */
export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
};

/**
 * Gets the current access token, if it does not exist in memory, attempts to get it from local storage.
 * @returns The access token if it exists.
 */
export const getAccessToken = (): string | null => {
  if (accessToken) {
    return accessToken;
  }

  const token = localStorage.getItem('accessToken');
  if (token) accessToken = token;
  return token;
};

/**
 * Gets an authentication header with the current access token.
 * @returns The authentication header.
 */
export const getAuthenticationHeader = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

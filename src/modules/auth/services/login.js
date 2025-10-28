import { frontendErrorMessage } from '../helpers/backendError';

export const login = async (username, password) => {
  const response = await fetch('api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    return {
      data: null,
      error: {
        ...errorData,
        frontendErrorMessage: frontendErrorMessage[errorData.code],
      },
    };
  }

  const token = await response.json();

  return { data: token, error: null };
};
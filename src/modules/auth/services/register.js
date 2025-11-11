import { frontendErrorMessage } from '../helpers/backendError';

export const register = async (username, password, email, role) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email, role }),
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

  let data = null;

  try {
    const rawBody = await response.text();

    data = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    data = null;
  }

  return { data, error: null };
};

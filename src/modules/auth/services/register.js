import axios from 'axios';

export const register = async ({ userName, email, password, name, phoneNumber, role }) => {
  try {
    const response = await axios.post('/api/auth/register', {
      userName,
      email,
      password,
      name,
      phoneNumber,
      role,
    });

    return { data: response.data };
  } catch (error) {
    return { error: error.response?.data };
  }
};
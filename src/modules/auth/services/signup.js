import { instance } from "../../shared/api/axiosInstance";

const register = async (username, email, password, role) => {
  try {
    const response = await instance.post('/api/auth/register-with-role', {
      username,
      email,
      password,
      role
    });

    return { user: response.data };
  } catch (error) {
    return { error: error.response.data };
  }
};

export default register;
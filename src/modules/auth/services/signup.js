import { instance } from "../../shared/api/axiosInstance";

const register = async (username, email, password, role) => {
  try {
    const response = await instance.post('/api/auth/register-with-role', {
      username,
      email,
      password,
      role
    });

    // CORRECCIÓN: Devolver response.data completo (contiene token y customerId)
    return { user: response.data, error: null };
  } catch (error) {
    return { user: null, error: error.response?.data || "Error de conexión" };
  }
};

export default register;
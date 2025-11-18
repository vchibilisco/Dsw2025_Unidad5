import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  const response = await instance.post('api/auth/login', { username, password });

  return { data: response.data.token, error: null };
};
import { instance } from '../../shared/api/axiosInstance';

export const getCustomerProducts = async () => {
  const response = await instance.get('api/products');

  return { data: response.data, error: null };
};

import { instance } from '../../shared/api/axiosInstance';

export const getCustomerProducts = async () => {
  const response = await instance.get('api/products');

  return { data: response.data, error: null };
};

export const searchCustomerProducts = async (term) => {
  try {
    const response = await instance.get('api/products/search', {
      params: { term },
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

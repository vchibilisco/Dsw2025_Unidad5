import { instance } from '../../../shared/api/axiosInstance';

export const getOrderCount = async () => {
  const response = await instance.get('api/orders/count');

  return { data: response.data, error: null };
};

export const getProductCount = async () => {
  try {
    const response = await instance.get('api/products/count');

    return { data: response.data, error: null };
  } catch (error) {

    return { data: null, error };
  }
};
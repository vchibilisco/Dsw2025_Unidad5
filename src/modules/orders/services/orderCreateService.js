import { instance } from '../../shared/api/axiosInstance';

export const createOrder = async (orderPayload) => {
  try {
    const response = await instance.post('/api/orders', orderPayload);

    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error al crear orden:', error);

    return { data: null, error };
  }
};
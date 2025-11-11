import { instance } from '../../shared/api/axiosInstance';

export const getOrders = async (customerId = null, status = null, pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({
    customerId,
    status,
    pageNumber,
    pageSize,
  });

  try {
    
    const response = await instance.get(`api/orders?${queryString}`);

    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data : { message: err.message };

    return { data: null, error };
  }
};

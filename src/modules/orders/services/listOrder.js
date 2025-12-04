import { instance } from '../../shared/api/axiosInstance';

export const orderStatus = {
  ALL: '', 
  PENDING: 0,
  SHIPPED: 1,
  DELIVERED: 2,
  CANCELLED: 3
};

export const getOrdersAdmin = async (status, searchTerm, pageNumber, pageSize) => {
  try {
    const params = {
      pageNumber,
      pageSize
    };

    if (status !== '') {
      params.status = status;
    }

    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    const response = await instance.get('/api/orders/admin', { params });
    
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};
import { instance } from '../../shared/api/axiosInstance';

export const getOrdersWithCustomerName = async (search, status, pageNumber, pageSize) => {
  const query = new URLSearchParams();

  if (search) query.append('CustomerName', search);

  if (status && status !== 'ALL') query.append('OrderStatus', status);

  query.append('pageNumber', pageNumber);

  query.append('pagesize', pageSize);

  try {
    const response = await instance.get(`/api/orders/with-customer-name?${query.toString()}`);

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
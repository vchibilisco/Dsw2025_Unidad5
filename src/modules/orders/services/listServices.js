import { instance } from '../../shared/api/axiosInstance';

export const getOrders = async (
  search = null,
  status = null,
  pageNumber = 1,
  pageSize = 10
) => {
  const query = new URLSearchParams();

  if (search) query.append('CustomerId', search); // GUID válido
  if (status && status.toLowerCase() !== 'all') {
  query.append('OrderStatus', status.toUpperCase());
}
  query.append('pageNumber', pageNumber);
  query.append('pagesize', pageSize);

  const response = await instance.get(`api/orders?${query.toString()}`);
  return { data: response.data, error: null };
};
export const getOrdersWithCustomerName = async (search, status, pageNumber, pageSize) => {
  const query = new URLSearchParams();

  if (search) query.append('CustomerId', search);
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



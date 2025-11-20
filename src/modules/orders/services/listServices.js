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


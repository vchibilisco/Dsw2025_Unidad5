import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (status = null, search = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    status,
    search,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products/admin?${queryString}`);

  return { data: response.data, error: null };
};
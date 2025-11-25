import { instance } from '../../shared/api/axiosInstance';

export const getClientProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products?${queryString}`);

  return { data: response.data, error: null };
};

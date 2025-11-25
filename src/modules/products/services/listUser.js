import { instance } from '../../shared/api/axiosInstance';

export const getClientProducts = async (search = "", status = "enabled", pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({
    search,
    status, // SIEMPRE productos habilitados
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products?${queryString}`);

  return { data: response.data, error: null };
};
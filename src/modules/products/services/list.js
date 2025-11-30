import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (status = null, SearchTerm = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    status,
    SearchTerm,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products/admin?${queryString}`);

  console.log("FETCHING WITH:", status, SearchTerm, pageNumber, pageSize);

  return { data: response.data, error: null };
};
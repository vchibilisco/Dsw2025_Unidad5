
import { instance } from '../../shared/api/axiosInstance';

const getTotalProducts = async () => {
  const response = await instance.get("api/products/admin");

  return { data: response.data, error: null };
};

export default getTotalProducts;
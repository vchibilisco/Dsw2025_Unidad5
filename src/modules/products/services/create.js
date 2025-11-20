import { instance } from '../../shared/api/axiosInstance';

export const createProduct = async (formData) => {
  await instance.post('/api/products', {
    sku: formData.sku,
    internalCode: formData.cui,
    name: formData.name,
    description: formData.description,
    price: formData.price,
    stock: formData.stock,

  });
};
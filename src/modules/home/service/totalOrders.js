import { instance } from "../../shared/api/axiosInstance";

const getTotalOrders = async () => {
    const response = await instance.get('/api/orders/admin');

    return {data: response.data, error: null};
};

export default getTotalOrders;
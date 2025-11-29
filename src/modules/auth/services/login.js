import { instance } from '../../shared/api/axiosInstance';
import { mapBackendError } from '../../shared/helpers/mapBackendError';
import { frontendErrorMessage } from '../helpers/backendError';

export const login = async (username, password) => {
  try {
    const response = await instance.post('api/auth/login', { username, password });

    return { data: response.data, error: null };
  } catch (err) {
    // Siempre remapeamos con los mensajes del front para priorizarlos
    const mappedError = mapBackendError(err, frontendErrorMessage);

    return { data: null, error: mappedError };
  }
};

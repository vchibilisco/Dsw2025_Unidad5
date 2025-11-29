const DEFAULT_ERROR_MESSAGE = 'Llame a soporte';

const normalizeErrors = (errors = []) => {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors.map((error) => ({
    code: error.code ?? error.Code ?? null,
    message: error.message ?? error.Message ?? '',
  }));
};

const buildDetail = (detail, title, normalizedErrors) => {
  if (detail) return detail;

  const fromErrors = normalizedErrors
    .map((err) => err.message)
    .filter(Boolean)
    .join(' ');

  if (fromErrors) return fromErrors;

  return title || '';
};

/**
 * Normaliza el error que devuelve el backend a un formato comun:
 * {
 *   code: number | null,
 *   errors: [{ code, message }],
 *   frontendErrorMessage: string
 * }
 */
const mapBackendError = (errorLike, frontendMessages = {}, fallbackMessage = DEFAULT_ERROR_MESSAGE) => {
  const raw = errorLike?.response?.data ?? errorLike ?? {};
  const errors = normalizeErrors(raw.errors);
  const code = raw.internalCode ?? raw.code ?? errors[0]?.code ?? null;
  const detail = buildDetail(raw.detail, raw.title, errors);

  const backendMessage = detail || fallbackMessage;

  return {
    ...raw,
    code,
    errors,
    backendMessage,
    frontendErrorMessage: (code && frontendMessages[code]) || null,
  };
};

export {
  mapBackendError,
};

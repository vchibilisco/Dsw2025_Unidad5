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
  const hasSpecificErrors = errors.length > 0;

  // Mensaje preferido: solo usamos el mapeo general cuando no hay errores detallados.
  let frontendMessage = (code && frontendMessages[code]) || null;

  // Caso especial: el backend devuelve 1001 pero trae errores con codigos especificos (2000s, etc.)
  // No mostrar el mensaje generico 1001 si tenemos errores puntuales.
  if (code === 1001 && hasSpecificErrors) {
    frontendMessage = null;
  }

  return {
    ...raw,
    code,
    errors,
    backendMessage,
    frontendErrorMessage: frontendMessage,
  };
};

export {
  mapBackendError,
};

import { useState } from "react";

/**
 * Hook para manejar múltiples banderas booleanas (por nombre).
 */
export function useToggleMap(initialState = {}) {
  const [state, setState] = useState(initialState);

  const open = (key) => setState((prev) => ({ ...prev, [key]: true }));
  const close = (key) => setState((prev) => ({ ...prev, [key]: false }));
  const toggle = (key) => setState((prev) => ({ ...prev, [key]: !prev[key] }));
  const set = (key, value) => setState((prev) => ({ ...prev, [key]: value }));

  return { state, open, close, toggle, set };
}

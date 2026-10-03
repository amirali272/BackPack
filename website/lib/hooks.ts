"use client";

import { useCallback, useState } from "react";

/**
 * Open/close state for a dialog that carries a payload. The payload is kept
 * after closing so the dialog's content doesn't blank out during its exit
 * animation.
 */
export function useDisclosure<T>() {
  const [state, setState] = useState<{ open: boolean; data: T | null }>({ open: false, data: null });
  const show = useCallback((data: T) => setState({ open: true, data }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  return { open: state.open, data: state.data, show, close };
}

import { useState } from "react";
import type { Toast as ToastProps } from "../types/toast";

interface ToastState {
  toasts: ToastProps[];
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
  duration?: number;
}

export function useToast() {
  const [state, setState] = useState<ToastState>({
    toasts: [],
  });

  function toast(options: ToastOptions) {
    const id = Math.random().toString(36).slice(2);
    const toast: ToastProps = {
      id,
      ...options,
      variant: options.variant ?? "default",
      duration: options.duration ?? 5000,
    };

    setState((prevState) => ({
      toasts: [...prevState.toasts, toast],
    }));

    if (toast.duration > 0) {
      setTimeout(() => {
        dismiss(toast.id);
      }, toast.duration);
    }

    return toast;
  }

  function dismiss(id: string) {
    setState((prevState) => ({
      toasts: prevState.toasts.filter((toast) => toast.id !== id),
    }));
  }

  function dismissAll() {
    setState({
      toasts: [],
    });
  }

  return {
    toast,
    dismiss,
    dismissAll,
    toasts: state.toasts,
  };
}
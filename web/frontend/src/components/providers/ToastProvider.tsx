import React from 'react';
import {
  ToastProvider as RadixToastProvider,
  ToastViewport
} from '../ui/Toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <RadixToastProvider>
      {children}
      <ToastViewport />
    </RadixToastProvider>
  );
};
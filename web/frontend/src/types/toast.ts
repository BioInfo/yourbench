export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive';
  duration?: number;
}

export interface ToastActionElement {
  altText: string;
  onClick: () => void;
  children?: React.ReactNode;
}
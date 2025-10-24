import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import ToastNotification from '../components/ToastNotification';

/**
 * Toast Context Types
 */
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  hideToast: () => void;
}

/**
 * Create Toast Context
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider Component
 * Provides global toast notification system to entire app
 * Eliminates need for each screen to manage toast state
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState(3000);

  /**
   * Show toast notification
   */
  const showToast = useCallback(
    (msg: string, toastType: ToastType = 'info', toastDuration: number = 3000) => {
      setMessage(msg);
      setType(toastType);
      setDuration(toastDuration);
      setVisible(true);
    },
    []
  );

  /**
   * Show success toast (shorthand)
   */
  const showSuccess = useCallback((msg: string) => {
    showToast(msg, 'success');
  }, [showToast]);

  /**
   * Show error toast (shorthand)
   */
  const showError = useCallback((msg: string) => {
    showToast(msg, 'error');
  }, [showToast]);

  /**
   * Show info toast (shorthand)
   */
  const showInfo = useCallback((msg: string) => {
    showToast(msg, 'info');
  }, [showToast]);

  /**
   * Show warning toast (shorthand)
   */
  const showWarning = useCallback((msg: string) => {
    showToast(msg, 'warning');
  }, [showToast]);

  /**
   * Hide toast notification
   */
  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastNotification
        visible={visible}
        message={message}
        type={type}
        duration={duration}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to use toast context
 * @throws Error if used outside ToastProvider
 * 
 * @example
 * ```tsx
 * const toast = useToast();
 * toast.showSuccess('Profile updated!');
 * toast.showError('Failed to load data');
 * ```
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;

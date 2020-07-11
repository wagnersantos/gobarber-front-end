import React, { createContext, useCallback, useState, useContext } from 'react';
import { uuid } from 'uuidv4';

import { ToastContainer } from '../../components';

interface ToastContextDTO {
  addToast(message: Omit<ToastMessageDTO, 'id'>): void;
  removeToast(id: string): void;
}

export interface ToastMessageDTO {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

const ToastContext = createContext<ToastContextDTO>({} as ToastContextDTO);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessageDTO[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessageDTO, 'id'>) => {
      const id = uuid();
      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessages(prevState => [...prevState, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages(prevState => prevState.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextDTO {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

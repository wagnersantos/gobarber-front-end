import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../provider/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface AuthStateDTO {
  token: string;
  user: User;
}

interface AuthCredentialsDTO {
  email: string;
  password: string;
}

export interface AuthContextDTO {
  user: User;
  signIn(credentials: AuthCredentialsDTO): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextDTO>({} as AuthContextDTO);

export const AuthProvider: React.FC = ({ children }) => {
  const [dataAuth, setDataAuth] = useState<AuthStateDTO>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthStateDTO;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const { data } = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setDataAuth({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setDataAuth({} as AuthStateDTO);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setDataAuth({
        token: dataAuth.token,
        user,
      });
    },
    [dataAuth.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: dataAuth.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextDTO {
  const context = useContext(AuthContext);

  return context;
}

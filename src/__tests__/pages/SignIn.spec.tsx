import React from 'react';
import { render, fireEvent, wait, screen } from '@testing-library/react';

import Signin from '../../pages/Signin';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../core/hooks/Auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../core/hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    render(<Signin />);
  });

  it('should be able to sign in', async () => {
    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const buttonElement = screen.getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const buttonElement = screen.getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login false', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const buttonElement = screen.getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'joedoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});

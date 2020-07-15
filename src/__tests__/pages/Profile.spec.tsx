import React from 'react';
import { render, screen, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import api from '../../core/provider/api';
import { mockDataAccount, mockAccount } from '../../core/mocks/mockAccount';

import Profile from '../../pages/Profile';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../core/hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('../../core/hooks/Auth', () => {
  return {
    useAuth: () => ({
      user: mockDataAccount,
      updateUser: () => jest.fn(),
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

const apiMock = new MockAdapter(api);

describe('Profile pages', () => {
  beforeEach(() => {
    render(<Profile />);
    jest.clearAllMocks();
  });

  it('should be render Profile', () => {
    mockAccount();
    expect(screen.getByText('Meu perfil')).toBeInTheDocument();
  });

  it('should be able to update credentials', async () => {
    const nameField = screen.getByPlaceholderText('Nome');
    const emailField = screen.getByPlaceholderText('E-mail');
    const oldPasswordField = screen.getByPlaceholderText('Senha atual');
    const passwordField = screen.getByPlaceholderText('Nova senha');
    const passwordConfirmationField = screen.getByPlaceholderText(
      'Confirmar senha',
    );
    const buttonElement = screen.getByText('Confirmar mudanças');
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const oldPassword = '654321';
    const password = '123456';

    apiMock.onPut('/profile').reply(200);

    fireEvent.change(nameField, { target: { value: name } });
    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(oldPasswordField, { target: { value: oldPassword } });
    fireEvent.change(passwordField, { target: { value: password } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: password },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should be able to update name and email', async () => {
    const nameField = screen.getByPlaceholderText('Nome');
    const emailField = screen.getByPlaceholderText('E-mail');
    const buttonElement = screen.getByText('Confirmar mudanças');
    const name = 'John Doe';
    const email = 'johndoe@example.com';

    apiMock.onPut('/profile').reply(200);

    fireEvent.change(nameField, { target: { value: name } });
    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should be not able to update profile with invalid email', async () => {
    const nameField = screen.getByPlaceholderText('Nome');
    const emailField = screen.getByPlaceholderText('E-mail');
    const buttonElement = screen.getByText('Confirmar mudanças');
    const name = 'John Doe';
    const email = 'invalid-email';

    apiMock.onPut('/profile').reply(200);

    fireEvent.change(nameField, { target: { value: name } });
    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
      expect(mockedHistoryPush).not.toHaveBeenCalledWith();
    });
  });
});

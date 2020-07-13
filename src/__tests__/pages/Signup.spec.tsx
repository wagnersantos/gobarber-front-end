import React from 'react';
import { render, fireEvent, wait, screen } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import api from '../../core/provider/api';

import Signup from '../../pages/Signup';

const mockedHistoryPush = jest.fn();
const mockedSignup = jest.fn();
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
      signup: mockedSignup,
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

const apiMock = new MockAdapter(api);

describe('Signup page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    render(<Signup />);
  });

  it('should be able to sign up', async () => {
    const nameField = screen.getByPlaceholderText('Nome');
    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const buttonElement = screen.getByText('Cadastrar');

    apiMock.onPost('/users').reply(200);

    fireEvent.change(nameField, { target: { value: 'john doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const nameField = screen.getByPlaceholderText('Nome');
    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const buttonElement = screen.getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'john doe' } });
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if signup false', async () => {
    const nameField = screen.getByPlaceholderText('Nome');
    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const buttonElement = screen.getByText('Cadastrar');

    apiMock.onPost('/users').reply(500);

    fireEvent.change(nameField, { target: { value: 'john doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import api from '../../core/provider/api';

import { mockAccount } from '../../core/mocks/mockAccount';

import ResetPassword from '../../pages/ResetPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      search: '?token=token-123',
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
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
beforeEach(() => {
  render(<ResetPassword />);
});

describe('ResetPassword pages', () => {
  it('should be render ResetPassword', () => {
    mockAccount();
    expect(screen.getByText('Resetar senha')).toBeInTheDocument();
  });

  it('should be able to ResetPassword', async () => {
    const passwordField = screen.getByPlaceholderText('Nova senha');
    const passwordConfirmationField = screen.getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = screen.getByText('Alterar minha senha');
    const password = '123456';

    apiMock.onPost('/password/reset').reply(200);

    fireEvent.change(passwordField, { target: { value: password } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: password },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });
});

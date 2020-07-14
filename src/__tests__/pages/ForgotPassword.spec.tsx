import React from 'react';
import { render, screen, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import api from '../../core/provider/api';
import { mockAccount } from '../../core/mocks/mockAccount';

import ForgotPassword from '../../pages/ForgotPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../core/hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
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

describe('ForgotPassword pages', () => {
  beforeEach(() => {
    render(<ForgotPassword />);
  });

  it('should be render ForgotPassword', () => {
    mockAccount();
    expect(screen.getByText('Recuperar senha')).toBeInTheDocument();
  });

  it('should be able to forgot password', async () => {
    const emailField = screen.getByPlaceholderText('E-mail');
    const buttonElement = screen.getByText('Recuperar');
    const email = 'johndoe@example.com';

    apiMock
      .onPost('/forgot-password', {
        email,
      })
      .reply(200);

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });
});

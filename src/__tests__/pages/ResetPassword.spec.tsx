import React from 'react';
import { render, screen, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import * as RouterDom from 'react-router';
import { createMemoryHistory, MemoryHistory } from 'history';

import api from '../../core/provider/api';

import { mockAccount } from '../../core/mocks/mockAccount';

import ResetPassword from '../../pages/ResetPassword';

const mockedAddToast = jest.fn();
const mockLocation = jest.fn(() => 'teste');

jest.mock('../../core/hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

const sutFactory = (
  history = createMemoryHistory({
    initialEntries: ['/reset-password?token=token-123'],
  }),
): void => {
  render(
    <RouterDom.Router history={history}>
      <ResetPassword />
    </RouterDom.Router>,
  );
};

const apiMock = new MockAdapter(api);

describe('ResetPassword pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be render ResetPassword', () => {
    sutFactory();
    mockAccount();
    expect(screen.getByText('Resetar senha')).toBeInTheDocument();
  });

  it('should be able to ResetPassword', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/reset-password?token=token-123'],
    });
    const mockedHistory = jest.spyOn(history, 'push');
    sutFactory(history);
    const passwordField = screen.getByPlaceholderText('Nova senha');
    const passwordConfirmationField = screen.getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = screen.getByText('Alterar minha senha');
    const password = '123456';

    apiMock.onPost('/password/reset').reply(200);

    fireEvent.change(passwordField, {
      target: { value: password },
    });
    fireEvent.change(passwordConfirmationField, {
      target: { value: password },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistory).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to ResetPassword in with invalid password match', async () => {
    sutFactory();
    const passwordField = screen.getByPlaceholderText('Nova senha');
    const passwordConfirmationField = screen.getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = screen.getByText('Alterar minha senha');

    apiMock.onPost('/password/reset').reply(404);

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123' },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });

  it('should not be able to ResetPassword in without valid token', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/reset-password'],
    });
    sutFactory(history);
    const passwordField = screen.getByPlaceholderText('Nova senha');
    const passwordConfirmationField = screen.getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = screen.getByText('Alterar minha senha');

    apiMock.onPost('/password/reset').reply(404);

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});

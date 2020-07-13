import React from 'react';
import { render, screen } from '@testing-library/react';

import { mockAccount } from '../../core/mocks/mockAccount';

import ForgotPassword from '../../pages/ForgotPassword';

const mockedHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('ForgotPassword pages', () => {
  it('should be render ForgotPassword', () => {
    mockAccount();
    render(<ForgotPassword />);
    expect(screen.getByText('Recuperar senha')).toBeInTheDocument();
  });
});

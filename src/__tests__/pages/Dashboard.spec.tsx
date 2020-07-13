import React from 'react';
import { render, screen } from '@testing-library/react';

import { mockDataAccount, mockAccount } from '../../core/mocks/mockAccount';

import Dashboard from '../../pages/Dashboard';

const mockedHistoryPush = jest.fn();

jest.mock('../../core/hooks/Auth', () => {
  return {
    useAuth: () => ({
      user: mockDataAccount,
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

describe('Dashboard pages', () => {
  it('should be render Dashboard', () => {
    mockAccount();
    render(<Dashboard />);
    expect(screen.getByText('Bem vindo,')).toBeInTheDocument();
  });
});

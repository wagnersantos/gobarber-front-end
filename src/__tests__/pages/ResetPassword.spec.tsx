import React from 'react';
import { render, screen } from '@testing-library/react';

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
      location: '?token=token-123',
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

describe('ResetPassword pages', () => {
  it('should be render ResetPassword', () => {
    mockAccount();
    render(<ResetPassword />);
    expect(screen.getByText('Resetar senha')).toBeInTheDocument();
  });
});

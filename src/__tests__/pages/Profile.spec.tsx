import React from 'react';
import { render, screen } from '@testing-library/react';

import { debug } from 'console';
import { mockDataAccount, mockAccount } from '../../core/mocks/mockAccount';

import Profile from '../../pages/Profile';

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

describe('Profile pages', () => {
  it('should be render Profile', () => {
    mockAccount();
    render(<Profile />);
    expect(screen.getByText('Meu perfil')).toBeInTheDocument();
  });
});

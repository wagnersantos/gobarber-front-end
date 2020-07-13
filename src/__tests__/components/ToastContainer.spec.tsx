import React from 'react';
import { render, screen, fireEvent, wait } from '@testing-library/react';

import ToastContainer from '../../components/ToastContainer';

const mockedRemoveToast = jest.fn();

jest.mock('../../core/hooks/Toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

type IType = {
  type?: 'success' | 'error' | 'info';
};

const sutFactory = ({ type }: IType): void => {
  render(
    <ToastContainer
      messages={[
        {
          id: 'id',
          type,
          title: 'title test',
          description: 'desc test',
        },
      ]}
    />,
  );
};

describe('ToastContainer component', () => {
  it('should be able to a ToastContainer', async () => {
    sutFactory({ type: 'success' });
    expect(screen.getByText('title test')).toBeInTheDocument();
    expect(screen.getByText('desc test')).toBeInTheDocument();
  });

  it('should be able to show default type', async () => {
    sutFactory({ type: undefined });
    expect(screen.getByText('title test')).toBeInTheDocument();
    expect(screen.getByText('desc test')).toBeInTheDocument();
  });

  it('should be able to remove ToastContainer', async () => {
    sutFactory({ type: 'error' });
    fireEvent.click(screen.getByRole('button'));
    await wait(() => {
      expect(mockedRemoveToast).toHaveBeenCalledWith(
        expect.stringContaining('id'),
      );
    });
  });
});

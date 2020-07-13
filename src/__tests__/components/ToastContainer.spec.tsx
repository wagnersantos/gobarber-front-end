import React from 'react';
import { render, screen } from '@testing-library/react';

import ToastContainer from '../../components/ToastContainer';

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
});

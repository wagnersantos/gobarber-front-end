import React from 'react';
import { render, screen } from '@testing-library/react';

import ToastContainer from '../../components/ToastContainer';

const sutFactory = (): void => {
  render(
    <ToastContainer
      messages={[
        {
          id: 'id',
          type: 'success',
          title: 'title test',
          description: 'desc test',
        },
      ]}
    />,
  );
};

describe('ToastContainer component', () => {
  it('should be able to a ToastContainer', async () => {
    sutFactory();
    expect(screen.getByText('title test')).toBeInTheDocument();
    expect(screen.getByText('desc test')).toBeInTheDocument();
  });
});

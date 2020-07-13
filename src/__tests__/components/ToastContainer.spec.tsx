import React from 'react';
import { render, screen } from '@testing-library/react';

import ToastContainer from '../../components/ToastContainer';

describe('ToastContainer component', () => {
  it('should be able to an ToastContainer', async () => {
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

    expect(screen.getByText('title test')).toBeInTheDocument();
    expect(screen.getByText('desc test')).toBeInTheDocument();
  });
});

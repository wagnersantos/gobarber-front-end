import React from 'react';
import { render, screen } from '@testing-library/react';

import Tooltip from '../../components/Tooltip';

describe('Input component', () => {
  it('should be able to show tooltip correctly', async () => {
    render(<Tooltip title="test title">test text</Tooltip>);
    expect(screen.getByText('test title')).toBeInTheDocument();
    expect(screen.getByText('test text')).toBeInTheDocument();
  });
});

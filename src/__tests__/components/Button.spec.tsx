import React from 'react';
import { render, screen, RenderResult } from '@testing-library/react';

import Button, { ButtonProps } from '../../components/Button';

const sutFactory = ({ loading }: ButtonProps): RenderResult =>
  render(<Button loading={loading}>teste</Button>);

describe('Button component', () => {
  it('should be able show button', async () => {
    sutFactory({ loading: false });
    expect(screen.getByText('teste')).toBeTruthy();
  });

  it('should be able loading', async () => {
    sutFactory({ loading: true });
    expect(screen.getByText('Carregando...')).toBeTruthy();
  });
});

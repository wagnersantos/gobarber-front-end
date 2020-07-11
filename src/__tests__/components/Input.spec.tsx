import React from 'react';
import { render, fireEvent, wait, screen } from '@testing-library/react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  beforeEach(() => render(<Input name="email" placeholder="E-mail" />));

  it('should be able to an input', async () => {
    expect(screen.getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const inputElement = screen.getByPlaceholderText('E-mail');
    const containerElement = screen.getByTestId('input-container');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(containerElement).toHaveStyle('border-color: #ff9000');
      expect(containerElement).toHaveStyle('color: #ff9000');
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(containerElement).not.toHaveStyle('border-color: #ff9000');
      expect(containerElement).not.toHaveStyle('color: #ff9000');
    });
  });

  it('should keep input border highlight when input filled', async () => {
    const inputElement = screen.getByPlaceholderText('E-mail');
    const containerElement = screen.getByTestId('input-container');

    fireEvent.change(inputElement, { target: { value: 'jodoe@example.com' } });
    fireEvent.blur(inputElement);

    await wait(() => {
      expect(containerElement).toHaveStyle('color: #ff9000');
    });
  });
});

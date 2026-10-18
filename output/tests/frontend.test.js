import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegistrationForm from '../src/RegistrationForm';
import { AuthProvider } from '../src/AuthContext';

describe('RegistrationForm Component', () => {
  const renderForm = () => render(
    <AuthProvider>
      <RegistrationForm />
    </AuthProvider>
  );

  it('shows validation error for invalid email format', async () => {
    renderForm();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('disables submit button when passwords do not match', async () => {
    renderForm();
    const pwdInput = screen.getByLabelText(/password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitBtn = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(pwdInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Different123!' } });

    expect(submitBtn).toBeDisabled();
  });

  it('shows strength indicator updates on password change', async () => {
    renderForm();
    const pwdInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(pwdInput, { target: { value: '123' } });
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
    
    fireEvent.change(pwdInput, { target: { value: 'Password123!@#' } });
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock Next.js navigation so we can observe routing behavior.
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

// We'll control the auth hook in tests.
const loginMock = vi.fn();
const authState = {
  login: loginMock,
  user: null,
  isInitialized: true,
};
vi.mock('@/components/global/auth-provider', () => ({
  useAuth: () => authState,
}));

// We're testing the login page user experience and the calls it makes.
import LoginPage from './page';

describe('LoginPage (staff)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default fetch stub for tests that don't care about network.
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'test-token' }) })
    );
  });

  it('disables submit when email or password is missing', async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /sign in to dashboard/i });
    expect(submitButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    expect(submitButton).toBeDisabled();

    await userEvent.clear(screen.getByLabelText(/email address/i));
    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    expect(submitButton).toBeDisabled();
  });

  it('calls login for operator role (client-side stub) after submission', async () => {
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/email address/i), 'operator@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');

    const submitButton = screen.getByRole('button', { name: /sign in to dashboard/i });
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    // should eventually call login after the simulated delay
    await waitFor(
      () => {
        expect(loginMock).toHaveBeenCalledWith({
          role: 'operator',
          username: 'operator@example.com',
        });
      },
      { timeout: 1500 }
    );
  });

  it('performs API login for cashier role and calls login with token', async () => {
    // Set the role to cashier by clicking the role button
    render(<LoginPage />);

    await userEvent.click(screen.getByText(/cashier/i));
    await userEvent.type(screen.getByLabelText(/email address/i), 'cashier@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');

    const submitButton = screen.getByRole('button', { name: /sign in to dashboard/i });
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/cashier/login'), expect.any(Object));
      expect(loginMock).toHaveBeenCalledWith({
        role: 'cashier',
        username: 'cashier@example.com',
        token: 'test-token',
      });
    });
  });

  it('displays an error message when server responds with a failure', async () => {
    // Override fetch to simulate a server error
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'invalid credentials' }),
      })
    );

    render(<LoginPage />);

    await userEvent.click(screen.getByText(/admin/i));
    await userEvent.type(screen.getByLabelText(/email address/i), 'admin@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');

    const submitButton = screen.getByRole('button', { name: /sign in to dashboard/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

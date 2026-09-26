import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../components/auth/LoginForm';
import axios from 'axios';
import * as navigation from 'next/navigation';

vi.mock('axios');

describe('LoginForm Component', () => {
    let mockPush: any;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockPush = vi.fn();
        vi.spyOn(navigation, 'useRouter').mockReturnValue({
            push: mockPush,
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            prefetch: vi.fn(),
        } as any);
    });

    it('renders login fields and buttons', () => {
        render(<LoginForm />);

        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('displays error snackbar if fields are empty upon submission', async () => {
        render(<LoginForm />);

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('All fields required')).toBeInTheDocument();
        });
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('submits credentials, sets token in localStorage, and navigates to /dashboard', async () => {
        vi.mocked(axios.post).mockResolvedValueOnce({
            data: {
                message: 'Login Successfully',
                user: {
                    name: 'Alice',
                    email: 'alice@example.com',
                    token: 'fake_jwt_token_123',
                },
            },
        });

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(localStorage.getItem('token')).toBe('fake_jwt_token_123');
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('shows error snackbar when login request fails', async () => {
        vi.mocked(axios.post).mockRejectedValueOnce({
            response: {
                data: { message: 'Password is Invalid' },
            },
        });

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Password is Invalid')).toBeInTheDocument();
        });
        expect(mockPush).not.toHaveBeenCalled();
    });
});

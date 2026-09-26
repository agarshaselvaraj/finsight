import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUpForm from '../components/auth/SignUpForm';
import axios from 'axios';
import * as navigation from 'next/navigation';

vi.mock('axios');

describe('SignUpForm Component', () => {
    let mockPush: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockPush = vi.fn();
        vi.spyOn(navigation, 'useRouter').mockReturnValue({
            push: mockPush,
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            prefetch: vi.fn(),
        } as any);
    });

    it('renders register form fields and buttons', () => {
        render(<SignUpForm />);

        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('validates minimum password length', async () => {
        render(<SignUpForm />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        });
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('submits registration successfully', async () => {
        vi.mocked(axios.post).mockResolvedValueOnce({
            data: { message: 'User Created Successfully' },
        });

        render(<SignUpForm />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('User Created Successfully')).toBeInTheDocument();
    });
});

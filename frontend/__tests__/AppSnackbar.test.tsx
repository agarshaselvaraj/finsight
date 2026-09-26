import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppSnackbar from '../components/common/AppSnackbar';

describe('AppSnackbar Component', () => {
    it('renders message when open is true', () => {
        render(
            <AppSnackbar
                open={true}
                message="Expense added successfully!"
                severity="success"
                onClose={vi.fn()}
            />
        );

        expect(screen.getByText('Expense added successfully!')).toBeInTheDocument();
    });

    it('does not display alert content when open is false', () => {
        render(
            <AppSnackbar
                open={false}
                message="Hidden message"
                severity="info"
                onClose={vi.fn()}
            />
        );

        expect(screen.queryByText('Hidden message')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const handleClose = vi.fn();
        render(
            <AppSnackbar
                open={true}
                message="Dismissible alert"
                severity="warning"
                onClose={handleClose}
            />
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});

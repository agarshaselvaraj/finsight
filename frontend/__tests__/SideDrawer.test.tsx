import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SideDrawer from '../components/layout/SideDrawer';
import * as navigation from 'next/navigation';

describe('SideDrawer Component', () => {
    it('renders all core navigation links', () => {
        render(<SideDrawer />);

        expect(screen.getByText('Expense Tracker')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Income')).toBeInTheDocument();
        expect(screen.getByText('Expense')).toBeInTheDocument();
    });

    it('navigates to corresponding route when link is clicked', () => {
        const mockPush = vi.fn();
        vi.spyOn(navigation, 'useRouter').mockReturnValue({
            push: mockPush,
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            prefetch: vi.fn(),
        } as any);

        render(<SideDrawer />);

        fireEvent.click(screen.getByText('Expense'));
        expect(mockPush).toHaveBeenCalledWith('/Expense');

        fireEvent.click(screen.getByText('Income'));
        expect(mockPush).toHaveBeenCalledWith('/Income');

        fireEvent.click(screen.getByText('Dashboard'));
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
});

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock useRouter and usePathname globally
vi.mock('next/navigation', () => {
    return {
        useRouter: () => ({
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            prefetch: vi.fn(),
        }),
        usePathname: () => '/dashboard',
    };
});

import { vi, beforeEach } from 'vitest';

// Create router
export const routerMock = {
    push: vi.fn(),
    beforeEach: vi.fn(),
};
vi.mock('vue-router', () => ({
    useRouter: (): unknown => ({
        push: routerMock.push,
        beforeEach: routerMock.beforeEach,
    }),
}));

beforeEach(() => {
    routerMock.push.mockReset();
    routerMock.beforeEach.mockReset();
});

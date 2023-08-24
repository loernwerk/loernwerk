import { vi, beforeEach } from 'vitest';

// Create router
export const routerMock = {
    push: vi.fn(),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
};
vi.mock('vue-router', () => ({
    useRouter: (): unknown => ({
        push: routerMock.push,
        beforeEach: routerMock.beforeEach,
        afterEach: routerMock.afterEach,
        currentRoute: {
            value: {
                name: 'CurrentRoute',
            },
        },
    }),
}));

beforeEach(() => {
    routerMock.push.mockReset();
    routerMock.beforeEach.mockReset();
    routerMock.afterEach.mockReset();
});

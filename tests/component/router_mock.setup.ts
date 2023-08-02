import { vi, beforeEach } from 'vitest';

// Create router
export const routerMock = {
    push: vi.fn()
}
vi.mock('vue-router', () => ({
    useRouter: (): unknown => ({
        push: routerMock.push
    })
}));

beforeEach(() => {
    routerMock.push.mockReset();
});
import { AccountRouterFactory } from '../../backend/router/AccountRouterFactory';
import express from 'express';

jest.mock('../../backend/controller/AccountController');
const app = express();
app.use('/api/account', new AccountRouterFactory().buildRouter());

describe('AccountRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('correct login call', () => {
        //leer
    });
});

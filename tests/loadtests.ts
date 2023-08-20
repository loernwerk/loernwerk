import axios, { AxiosResponse } from 'axios';
import { exit } from 'process';

const SERVER_URL = 'http://localhost:5000';
const LOGIN_USER = 'admin';
const LOGIN_PASSWORD = '12345678';
const VALID_SEQUENCE = 'ADFAAA';

const CONFIG = [
    // Account routes
    {
        method: 'POST',
        route: '/api/account/login',
        data: { usernameOrEmail: 'test', password: 'abc123' },
        requests: 100,
        expectedTime: 500,
        expectedStatus: 400,
        login: false,
    },
    {
        method: 'GET',
        route: '/api/account/',
        data: {},
        requests: 500,
        expectedTime: 600,
        expectedStatus: 200,
        login: true,
    },

    // Sequence routes
    {
        method: 'PATCH',
        route: '/api/sequence/',
        data: { code: VALID_SEQUENCE, title: 'New Sequence Title' },
        requests: 100,
        expectedTime: 400,
        expectedStatus: 404,
        login: true,
    },
    {
        method: 'GET',
        route: `/api/sequence/${VALID_SEQUENCE}/view`,
        data: {},
        requests: 500,
        expectedTime: 600,
        expectedStatus: 200,
        login: false,
    },
    {
        method: 'GET',
        route: `/api/sequence/${VALID_SEQUENCE}/view/0`,
        data: {},
        requests: 1000,
        expectedTime: 1200,
        expectedStatus: 200,
        login: false,
    },
];

/**
 * Main loadtest function
 */
async function main(): Promise<void> {
    console.log('Checking server availability...');
    try {
        await axios.post(
            SERVER_URL + '/api/account/login',
            { usernameOrEmail: LOGIN_USER, password: LOGIN_PASSWORD },
            { withCredentials: true, validateStatus: null }
        );
    } catch (e) {
        console.log(
            'Backend server could not be reached. Make sure that the backend server is running.'
        );
        console.log(e);
        exit(1);
    }

    console.log('Server availabiltiy confirmed. Starting load testing.');
    let successes = 0;
    const failures: string[] = [];
    for (const call of CONFIG) {
        const calls = [] as Promise<AxiosResponse>[];
        const startingTime = Date.now();

        for (let i = 0; i < call.requests; i++) {
            calls.push(
                axios({
                    url: call.route,
                    method: call.method,
                    baseURL: SERVER_URL,
                    data: call.data,
                    validateStatus: null,
                    withCredentials: call.login,
                })
            );
        }
        await Promise.all(calls);
        const endingTime = Date.now();
        const timeTook = endingTime - startingTime;
        const timeDiff = Math.abs(call.expectedTime - timeTook);

        const mismatchingReturnCodes = (
            calls as unknown as AxiosResponse[]
        ).filter((response) => {
            response.status !== call.expectedStatus;
        });

        if (
            timeTook < call.expectedTime &&
            mismatchingReturnCodes.length === 0
        ) {
            console.log(
                `✓ ${call.requests}x ${call.method} ${call.route} after ${timeTook}ms (-${timeDiff}ms)`
            );
            successes++;
        } else {
            console.log(
                `× ${call.requests}x ${call.method} ${
                    call.route
                } after ${timeTook}ms (${
                    timeTook > call.expectedTime
                        ? `+${timeDiff}`
                        : `-${timeDiff}`
                }ms)`
            );
            if (timeTook >= call.expectedTime) {
                failures.push(
                    `${call.requests}x ${call.method} ${call.route} took ${timeDiff}ms too long (${timeTook}ms instead of ${call.expectedTime}ms)`
                );
            }
            if (mismatchingReturnCodes.length !== 0) {
                const uniqueCodes: number[] = [];
                mismatchingReturnCodes.forEach((response) => {
                    const code = response.status;
                    if (!uniqueCodes.includes(code)) {
                        uniqueCodes.push(code);
                    }
                });
                failures.push(
                    `${call.requests}x ${call.method} ${
                        call.route
                    } returned a different response code than expected ${
                        mismatchingReturnCodes.length
                    } times. (${uniqueCodes.join(', ')})`
                );
            }
        }
    }

    console.log('--- [ TESTING COMPLETE ] ---');
    console.log(
        `Successful tests: ${successes}, failed tests: ${
            CONFIG.length - successes
        }.`
    );
    if (CONFIG.length - successes > 0) {
        console.log('Failures:');
        failures.forEach((failure) => {
            console.log(`  ${failure}`);
        });
    }
}

void main();

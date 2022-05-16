import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
    stages: [
        { duration: '5m', target: 250 },
        { duration: '10m', target: 250 },
        { duration: '5m', target: 0 },
    ],
    insecureSkipTLSVerify: true,

    thresholds: {
        http_req_duration: ['p(99)<1500'],
        http_req_failed: ['rate<0.01'],
        'checks{myTag:loginSuccess}': ['rate>0.95']
    }
};

const BASE_URL = 'https://localhost/api';
const USERNAME = 'lukBoss';
const PASSWORD = 'Zxcvbnm<>123';
const USERID = '70d83e02-32f5-49e8-bfcf-b291b15c8101';

export default function () {
    let formData = {
        username: USERNAME,
        password: PASSWORD
    };

    let headers = { 'Content-Type': 'application/json' };

    let loginResponse = http.post(`${BASE_URL}/user/login`, formData, { headers: headers });

    check(loginResponse,
        { 'logged in successfully': (resp) => resp.json('data') !== '' },
        { myTag: 'loginSuccess' }
    );

    let authHeaders = {
        headers: {
            Authorization: `Bearer ${loginResponse.json('access_token')}`,
        },
    };

    let targetUser = http.get(`${BASE_URL}/user/get/${USERID}`, authHeaders).json();

    check(targetUser, { 'retrieved user': (resp) => resp.length > 0 });

    sleep(1);
}
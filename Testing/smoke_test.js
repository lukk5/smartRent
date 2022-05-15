import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
 	vus: 1,
	duration: '1m',
	insecureSkipTLSVerify: true,

	thresholds: {
		http_req_duration: ['p(99)<1000']
	}
};

const BASE_URL = 'https://localhost/api';
const USERNAME = 'lukBoss';
const PASSWORD = 'Zxcvbnm<>123';
const USERID = '70d83e02-32f5-49e8-bfcf-b291b15c8101';


export default function () {
	let formData = {
		username: USERNAME,
		password: PASSWORD,
	};
	let headers = { 'Content-Type': 'application/json' };

	let loginResponse = http.post(`${BASE_URL}/user/login`, formData, { headers: headers });

	check(loginResponse, {
		'logged in successfully': (resp) => resp.json('data') !== ''
	});

	let authHeaders = {
		headers: {
			Authorization: `Bearer ${loginResponse.json('access_token')}`,
		},
	};

	let targetUser = http.get(`${BASE_URL}/user/get/${USERID}`, authHeaders).json();

	check(targetUser, { 'retrieved reservations': (res) => res.length > 0 });

	sleep(1);
}
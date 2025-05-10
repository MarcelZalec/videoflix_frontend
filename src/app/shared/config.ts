// hier werden die Urls bereitestellt
const API_BASE_URL = 'http://127.0.0.1:8000/api/';
const STATIC_BASE_URL = 'http://127.0.0.1:8000/';

const LOGIN_URL = 'login/';
const REGISTER_URL='registration/';
const RESETPASS = 'resetPass/';
const VIDEOS = 'videos/'

export const FULL_REGISTRATION_URL = API_BASE_URL + REGISTER_URL;
export const FULL_LOGIN_URL = API_BASE_URL + LOGIN_URL;
export const FULL_RESETPASS_URL = API_BASE_URL + RESETPASS;
export const FULL_VIDEOS_URL = API_BASE_URL + VIDEOS;
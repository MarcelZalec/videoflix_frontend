import { environment } from "../../environments/environment";

// the URLs are provided here
export const STATIC_BASE_URL = environment.apiUrl;
export const MEDIA_URL = STATIC_BASE_URL + 'media/';
const API_BASE_URL = STATIC_BASE_URL + 'api/';
const AUTH_BASE_URL = STATIC_BASE_URL + 'auth/';

const LOGIN_URL = 'login/';
const REGISTER_URL='registration/';
const RESETPASS = 'resetPass/';
const VIDEOS = 'videos/';
const AUTH = 'authorization/';
const STATUS = 'status/'

export const FULL_REGISTRATION_URL = AUTH_BASE_URL + REGISTER_URL;
export const FULL_LOGIN_URL = AUTH_BASE_URL + LOGIN_URL;
export const FULL_RESETPASS_URL = AUTH_BASE_URL + RESETPASS;
export const FULL_VIDEOS_URL = API_BASE_URL + VIDEOS;
export const FULL_AUTHORIZATION_URL = AUTH_BASE_URL + AUTH;
export const FULL_STATUS_URL = API_BASE_URL + STATUS;
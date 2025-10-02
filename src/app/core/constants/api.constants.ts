export const API_PREFIX = '/api';

// Authentication endpoints
export const AUTH_PREFIX = `${API_PREFIX}/auth`;

export const LOGIN = `${AUTH_PREFIX}/login`;
export const REGISTER = `${AUTH_PREFIX}/register`;
export const REFRESH_TOKEN = `${AUTH_PREFIX}/refresh-token`;
export const ACTIVE_USER = `${AUTH_PREFIX}/active-user`;
export const LOGOUT = `${AUTH_PREFIX}/logout`;

// User endpoints
export const USER_PREFIX = `${API_PREFIX}/users`;

export const REGISTER_USER = `${USER_PREFIX}/register`;
export const EMPLOYEES = `${USER_PREFIX}/employees`;
export const MANAGERS = `${USER_PREFIX}/managers`;

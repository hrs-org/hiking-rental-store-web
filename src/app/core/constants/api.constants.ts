export const API_PREFIX = '/api';

// Authentication endpoints
export const AUTH_PREFIX = `${API_PREFIX}/auth`;
export const LOGIN = `${AUTH_PREFIX}/login`;
export const REGISTER = `${AUTH_PREFIX}/register`;
export const REFRESH_TOKEN = `${AUTH_PREFIX}/refresh-token`;
export const ACTIVE_USER = `${AUTH_PREFIX}/active-user`;
export const LOGOUT = `${AUTH_PREFIX}/logout`;
export const CHANGE_PASSWORD = `${AUTH_PREFIX}/change-password`;
export const RESEND_VERIFICATION = `${AUTH_PREFIX}/resend-verification`;
export const VERIFY_EMAIL = `${AUTH_PREFIX}/verify-email`;
export const FORGOT_PASSWORD = `${AUTH_PREFIX}/forgot-password`;
export const RESET_PASSWORD = `${AUTH_PREFIX}/reset-password`;

// User endpoints
export const USER_PREFIX = `${API_PREFIX}/users`;
export const REGISTER_USER = `${USER_PREFIX}/register`;
export const EMPLOYEES = `${USER_PREFIX}/employees`;
export const MANAGERS = `${USER_PREFIX}/managers`;

// Item endpoints
export const ITEM_PREFIX = `${API_PREFIX}/items`;

// Catalog endpoints
export const CATALOG_PREFIX = `${API_PREFIX}/catalogs`;

// Order endpoints
export const ORDER_PREFIX = `${API_PREFIX}/orders`;
export const ORDER_BOOKINGS = `${ORDER_PREFIX}/bookings`;
export const ORDER_RENTS = `${ORDER_PREFIX}/rents`;
export const ORDER_APPROVE = `${ORDER_PREFIX}/{0}/approve`;
export const ORDER_CANCEL = `${ORDER_PREFIX}/{0}/cancel`;
export const ORDER_CONFIRM = `${ORDER_PREFIX}/{0}/confirm`;
export const ORDER_RETURN = `${ORDER_PREFIX}/{0}/return`;
export const ORDER_CLOSE = `${ORDER_PREFIX}/{0}/close`;

// Payment endpoints
export const PAYMENT_PREFIX = `${API_PREFIX}/payments`;
export const PAYMENT_CREATE_SESSION = `${PAYMENT_PREFIX}/create-session`;
export const PAYMENT_VERIFY = `${PAYMENT_PREFIX}/verify`;

// Item maintenance endpoints
export const ITEM_MAINTENANCE_PREFIX = `${API_PREFIX}/item-maintenances`;
export const ITEM_MAINTENANCE_FIX = `${ITEM_MAINTENANCE_PREFIX}/{0}/fix`;

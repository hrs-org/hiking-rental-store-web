import { HttpContextToken } from '@angular/common/http';

// Used to tell interceptor to skip adding Authorization header
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

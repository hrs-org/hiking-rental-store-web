import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { userReducer } from './state/user/user.reducer';
import { UserEffects } from './state/user/user.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { itemsReducer } from './state/items/items.reducer';
import { ItemEffects } from './state/items/items.effects';
import { storeReducer } from './state/store/store.reducer';
import { StoreEffects } from './state/store/store.effects';
import { ordersReducer } from './state/order/orders.reducer';
import { OrderEffects } from './state/order/orders.effect';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ...(environment.auth0?.enabled
      ? [
          provideAuth0({
            domain: environment.auth0.domain,
            clientId: environment.auth0.clientId,
            useRefreshTokens: true,
            useRefreshTokensFallback: true,
            cacheLocation: 'localstorage',
            authorizationParams: {
              redirect_uri: globalThis.location.origin,
              audience: environment.auth0.audience,
              scope: 'openid profile email offline_access',
            },
          }),
        ]
      : []),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      user: userReducer,
      items: itemsReducer,
      store: storeReducer,
      orders: ordersReducer,
    }),
    provideEffects([UserEffects, ItemEffects, StoreEffects, OrderEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};

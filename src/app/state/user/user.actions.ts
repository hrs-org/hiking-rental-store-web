import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/user/user';

export const loadUser = createAction('[User] Load User');

export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: any }>());

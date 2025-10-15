import { createReducer, on } from '@ngrx/store';
import { loadUserSuccess } from './user.actions';
import { User } from '../../core/models/user/user';

export interface UserState {
  user: User | null;
}

export const initialState: UserState = {
  user: null,
};

export const userReducer = createReducer(
  initialState,
  on(loadUserSuccess, (state, { user }): UserState => ({ ...state, user: user })),
);

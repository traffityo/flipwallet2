import {
    signInSuccess,
    signOutSuccess,
    signUpSuccess,
} from '@persistence/user/UserReducer';
import {StorageService} from '@modules/storage/StorageService';

export const UserAction = {
    signIn,
    signUp,
    signOut,
};

function signIn(params) {
    return async dispatch => {
        await StorageService.StorageSetItem('loggedIn', 'true', true);
        dispatch(signInSuccess(params));
    };
}

function signUp(params) {
    return async dispatch => {
        await StorageService.StorageSetItem('loggedIn', 'true', true);
        dispatch(signUpSuccess(params));
    };
}

function signOut() {
    return async dispatch => {
        await StorageService.StorageSetItem('loggedIn', 'false', true);
        dispatch(signOutSuccess());
    };
}

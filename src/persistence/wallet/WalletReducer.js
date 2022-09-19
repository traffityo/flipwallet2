import {createSlice} from '@reduxjs/toolkit';

const WalletReducer = createSlice({
    name: 'wallet',
    initialState: {
        activeWallet: {},
        wallets: [],
        tokens: [],
        totalBalance: 0.0,
        mnemonic: '',
    },
    reducers: {
        createWalletsSuccess(state, {payload}) {
            state.wallets = payload.wallets;
            state.tokens = payload.tokens;
            state.mnemonic = payload.mnemonic;
        },
        getWalletsSuccess(state, {payload}) {
            state.wallets = payload.wallets;
            state.tokens = payload.tokens;
            state.mnemonic = payload.mnemonic;
        },
        getAccountBalanceSuccess(state, {payload}) {
            state.wallets = payload.wallets;
            state.tokens = payload.tokens;
            state.totalBalance = Object.values([
                ...payload.wallets,
                ...payload.tokens,
            ]).reduce((sum, o) => {
                return sum + o.value;
            }, 0.0);
        },
        getActiveWalletSuccess(state, {payload}) {
            state.activeWallet = payload;
        },
    },
});

// Extract the action creators object and the reducer
const {actions, reducer} = WalletReducer;
// Extract and export each action creator by name
export const {
    createWalletsSuccess,
    getWalletsSuccess,
    getAccountBalanceSuccess,
    getActiveWalletSuccess,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

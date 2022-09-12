import {createSlice} from '@reduxjs/toolkit';

const WalletReducer = createSlice({
    name: 'wallet',
    initialState: {
        wallets: [],
        totalBalance: 0.0,
        mnemonic: '',
    },
    reducers: {
        createWalletsSuccess(state, {payload}) {
            state.wallets = payload.wallets;
            state.mnemonic = payload.mnemonic;
        },
        getWalletsSuccess(state, {payload}) {
            state.wallets = payload.wallets;
            state.mnemonic = payload.mnemonic;
        },
        getAccountBalanceSuccess(state, {payload}) {
            state.wallets = payload;
            state.totalBalance = Object.values(payload).reduce((sum, o) => {
                return sum + o.value;
            }, 0.0);
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
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

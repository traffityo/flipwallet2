import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const getWalletBySymbol = (array, symbol) => {
    return _.find(array, function (o) {
        return o.symbol === symbol;
    });
};
const WalletReducer = createSlice({
    name: 'wallet',
    initialState: {
        wallets: [],
        bnbWallet: {},
        usdtWallet: {},
        totalBalance: 0.0,
    },
    reducers: {
        createWalletsSuccess(state, {payload}) {
            state.wallets = payload;
            state.bnbWallet = getWalletBySymbol(payload, 'BNB');
            state.usdtWallet = getWalletBySymbol(payload, 'USDT');
        },
        getWalletsSuccess(state, {payload}) {
            state.wallets = payload;
            state.bnbWallet = getWalletBySymbol(payload, 'BNB');
            state.usdtWallet = getWalletBySymbol(payload, 'USDT');
        },
        getAccountBalanceSuccess(state, {payload}) {
            state.wallets = payload;
            state.bnbWallet = getWalletBySymbol(payload, 'BNB');
            state.usdtWallet = getWalletBySymbol(payload, 'USDT');
            state.totalBalance = state.usdtWallet.value;
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

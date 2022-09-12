import {WalletService} from '@persistence/wallet/WalletService';
import {
    createWalletsSuccess,
    getAccountBalanceSuccess,
    getWalletsSuccess,
} from '@persistence/wallet/WalletReducer';
import {StorageService} from '@modules/storage/StorageService';
import {MNEMONIC_KEY} from '@persistence/wallet/WalletConstant';
import _ from 'lodash';

export const WalletAction = {
    createWallets,
    getWallets,
    getAccountBalance,
    addWallet,
};

function createWallets(mnemonic, coinList = []) {
    return async dispatch => {
        const {success, data} = await WalletService.createWallets(
            mnemonic,
            coinList,
        );
        if (success) {
            const tokens = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol !== 'BTC' ||
                    wallet.symbol !== 'ETH' ||
                    wallet.symbol !== 'BNB' ||
                    wallet.symbol !== 'MATIC'
                );
            });
            const wallets = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol === 'BTC' ||
                    wallet.symbol === 'ETH' ||
                    wallet.symbol === 'BNB' ||
                    wallet.symbol === 'MATIC'
                );
            });
            dispatch(
                createWalletsSuccess({
                    mnemonic,
                    wallets: wallets,
                    tokens: tokens,
                }),
            );
        }
        return {success, data};
    };
}

function getWallets() {
    return async dispatch => {
        const {success, data} = await WalletService.getWallets();
        const mnemonic = await StorageService.StorageGetItem(
            MNEMONIC_KEY,
            true,
        );
        if (success) {
            const tokens = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol !== 'BTC' &&
                    wallet.symbol !== 'ETH' &&
                    wallet.symbol !== 'BNB' &&
                    wallet.symbol !== 'MATIC'
                );
            });
            const wallets = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol === 'BTC' ||
                    wallet.symbol === 'ETH' ||
                    wallet.symbol === 'BNB' ||
                    wallet.symbol === 'MATIC'
                );
            });
            dispatch(
                getWalletsSuccess({
                    mnemonic: mnemonic,
                    wallets: wallets,
                    tokens: tokens,
                }),
            );
        }
        return {success, data};
    };
}

function getAccountBalance() {
    return async dispatch => {
        const {success, data} = await WalletService.getAccountBalance();
        if (success) {
            const tokens = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol !== 'BTC' &&
                    wallet.symbol !== 'ETH' &&
                    wallet.symbol !== 'BNB' &&
                    wallet.symbol !== 'MATIC'
                );
            });
            const wallets = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol === 'BTC' ||
                    wallet.symbol === 'ETH' ||
                    wallet.symbol === 'BNB' ||
                    wallet.symbol === 'MATIC'
                );
            });
            dispatch(
                getAccountBalanceSuccess({wallets: wallets, tokens: tokens}),
            );
        }
        return {success, data};
    };
}

function addWallet(token, chain, contract, external) {
    return async dispatch => {
        const {success, data} = await WalletService.addWallet(
            token,
            chain,
            contract,
            external,
        );
        if (success) {
            const tokens = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol !== 'BTC' &&
                    wallet.symbol !== 'ETH' &&
                    wallet.symbol !== 'BNB' &&
                    wallet.symbol !== 'MATIC'
                );
            });
            const wallets = _.filter(data, function (wallet: any) {
                return (
                    wallet.symbol === 'BTC' ||
                    wallet.symbol === 'ETH' ||
                    wallet.symbol === 'BNB' ||
                    wallet.symbol === 'MATIC'
                );
            });
            dispatch(
                getAccountBalanceSuccess({wallets: wallets, tokens: tokens}),
            );
        }
        return {success, data};
    };
}

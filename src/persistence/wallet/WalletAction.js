import {WalletService} from '@persistence/wallet/WalletService';
import {
    createWalletsSuccess,
    getAccountBalanceSuccess,
    getWalletsSuccess,
} from '@persistence/wallet/WalletReducer';
import {StorageService} from '@modules/storage/StorageService';
import {MNEMONIC_KEY} from '@persistence/wallet/WalletConstant';

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
            dispatch(createWalletsSuccess({mnemonic, wallets: data}));
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
            dispatch(getWalletsSuccess({mnemonic: mnemonic, wallets: data}));
        }
        return {success, data};
    };
}

function getAccountBalance() {
    return async dispatch => {
        const {success, data} = await WalletService.getAccountBalance();
        if (success) {
            dispatch(getAccountBalanceSuccess(data));
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
            dispatch(getAccountBalanceSuccess(data));
        }
        return {success, data};
    };
}

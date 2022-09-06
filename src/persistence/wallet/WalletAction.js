import {WalletService} from '@persistence/wallet/WalletService';
import {
    createWalletsSuccess,
    getAccountBalanceSuccess,
    getWalletsSuccess,
} from '@persistence/wallet/WalletReducer';

export const WalletAction = {
    createWallets,
    getWallets,
    getAccountBalance,
};

function createWallets(mnemonic, coinList = []) {
    return async dispatch => {
        const {success, data} = await WalletService.createWallets(
            mnemonic,
            coinList,
        );
        if (success) {
            dispatch(createWalletsSuccess(data));
        }
        return {success, data};
    };
}

function getWallets() {
    return async dispatch => {
        const {success, data} = await WalletService.getWallets();
        if (success) {
            dispatch(getWalletsSuccess(data));
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

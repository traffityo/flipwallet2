import {WalletFactory} from '@coingrig/core';
import {generateWallet} from '@coingrig/wallet-generator';
import {StorageService} from '@modules/storage/StorageService';
import {WALLET_LIST_KEY} from '@persistence/wallet/WalletConstant';
import {applicationProperties} from '@src/application.properties';
import {WalletRepository} from '@persistence/wallet/WalletRepository';

export const WalletService = {
    createWallets,
    getWallets,
    getAccountBalance,
};

async function createWallets(mnemonic, coinList = []) {
    try {
        const wallets = [];
        for (const coin of coinList) {
            const chainType =
                coin.chain === 'BSC' ||
                coin.chain === 'POLYGON' ||
                coin.chain === 'ETH'
                    ? 'ETH'
                    : 'BTC';
            const newWallet = JSON.parse(
                await generateWallet(mnemonic, chainType),
            );
            const signer = WalletFactory.getWallet({...coin});
            const balance = await signer.getBalance();
            const wallet = {
                ...coin,
                privKey: newWallet.privateKey,
                walletAddress: newWallet.address,
                balance: balance.getValue(),
                value: 0,
                price: 0,
            };
            wallets.push(wallet);
        }
        await StorageService.StorageSetItem(
            WALLET_LIST_KEY,
            JSON.stringify(wallets),
            true,
        );
        await StorageService.StorageSetItem(
            applicationProperties.initKey,
            'true',
            true,
        );
        return {
            success: true,
            data: wallets,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: [],
        };
    }
}

async function getWallets() {
    try {
        const wallets = await StorageService.StorageGetItem(
            WALLET_LIST_KEY,
            true,
        );
        return {
            success: true,
            data: wallets,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: [],
        };
    }
}

async function getAccountBalance() {
    try {
        const wallets = await WalletRepository.getAccountBalance();
        return {
            success: true,
            data: wallets,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: [],
        };
    }
}

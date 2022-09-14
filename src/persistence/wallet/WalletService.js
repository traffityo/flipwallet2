import {WalletFactory} from '@coingrig/core';
import {generateWallet} from '@coingrig/wallet-generator';
import {StorageService} from '@modules/storage/StorageService';
import {
    MNEMONIC_KEY,
    WALLET_LIST_KEY,
} from '@persistence/wallet/WalletConstant';
import {applicationProperties} from '@src/application.properties';
import {WalletRepository} from '@persistence/wallet/WalletRepository';
import _ from 'lodash';
import BigNumber from 'bignumber.js';

export const WalletService = {
    createWallets,
    getWallets,
    getAccountBalance,
    getTransactionsByWallet,
    getWalletByChain,
    addWallet,
    getSupportedChainByName,
    getSupportedChainNameByID,
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
        await StorageService.StorageSetItem(MNEMONIC_KEY, mnemonic, true);
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

async function getWalletByChain(chain) {
    try {
        const wallets = await StorageService.StorageGetItem(
            WALLET_LIST_KEY,
            true,
            true,
        );
        const wallet = _.find(wallets, {chain: chain});
        return {
            success: true,
            data: wallet,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: {},
        };
    }
}

async function getWalletBySymbolAndContract(chain) {
    try {
        const wallets = await StorageService.StorageGetItem(
            WALLET_LIST_KEY,
            true,
        );
        const wallet = _.find(wallets, {chain: chain});
        return {
            success: true,
            data: wallet,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: {},
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

async function getTransactionsByWallet(wallet) {
    try {
        const transactions = await WalletRepository.getTransactionsByWallet(
            wallet,
        );
        return {
            success: true,
            data: transactions,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: [],
        };
    }
}

async function addWallet(data, chain, contract, external) {
    let wallet = {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        cid: data.id || data.symbol.toUpperCase(),
        chain: external ? 'cg_' + Date.now() : chain,
        type: external ? 'external' : 'token',
        decimals: null,
        contract: contract || null,
        privKey: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: data.market_data?.current_price?.usd ?? 0,
        active: true,
        image: data.thumb || null,
        walletAddress: null,
        version: applicationProperties.newAssetDescriptorVersion,
    };
    if (!external) {
        const walletByChain = await getWalletByChain(chain);
        if (walletByChain.success) {
            wallet.privKey = walletByChain.data.privKey;
            wallet.walletAddress = walletByChain.data.walletAddress;
        }

        let cryptoWallet = WalletFactory.getWallet({...wallet});
        let decimals = await cryptoWallet.getDecimals();
        let balance = await cryptoWallet.getBalance();
        wallet.decimals = decimals;
        wallet.balance = balance.confirmedBalance;
        wallet.unconfirmedBalance = balance.unconfirmedBalance;
        if (wallet.balance > 0) {
            wallet.value = Number(
                new BigNumber(wallet.balance).multipliedBy(wallet.price),
            );
        }
        const wallets = await StorageService.StorageGetItem(
            WALLET_LIST_KEY,
            true,
            true,
        );
        wallets.push(wallet);
        await StorageService.StorageSetItem(
            WALLET_LIST_KEY,
            JSON.stringify(wallets),
            true,
        );
        return {
            success: true,
            data: wallets,
        };
    }
    return {
        success: false,
        data: [],
    };
}

function getSupportedChainByName(name) {
    switch (name) {
        case 'ethereum':
            return 'ETH';
        case 'binance-smart-chain':
            return 'BSC';
        case 'polygon-pos':
            return 'POLYGON';
        default:
            return '';
    }
}

function getSupportedChainNameByID(id) {
    switch (id) {
        case 'ETH':
            return 'Ethereum';
        case 'binance-smart-chain':
        case 'BSC':
            return 'Binance Smart Chain';
        case 'polygon-pos':
        case 'POLYGON':
            return 'Polygon';
        case 'BTC':
            return 'Bitcoin';
        default:
            return '';
    }
}

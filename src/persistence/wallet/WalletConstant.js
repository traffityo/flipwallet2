import {applicationProperties} from '@src/application.properties';

export const MNEMONIC_KEY = '@Mnemonic';
export const WALLET_LIST_KEY = '@WalletList';
export const CHAIN_ID_MAP = {
    ETH: 1,
    BSC: 56,
    POLYGON: 137,
};
export const CHAIN_ID_TYPE_MAP = {
    1: 'ETH',
    56: 'BSC',
    137: 'POLYGON',
};
export const ASSET_TYPE_COIN = 'coin';
export const ASSET_TYPE_TOKEN = 'token';
export const ASSET_TYPE_NFT = 'nft';
export const MAIN_COINS = ['BTC', 'ETH', 'BNB', 'MATIC'];
export const COIN_LIST = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        cid: 'bitcoin',
        chain: 'BTC',
        type: ASSET_TYPE_COIN,
        decimals: 8,
        contract: null,
        privKey: null,
        walletAddress: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: 0,
        active: true,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        version: applicationProperties.newAssetDescriptorVersion,
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        cid: 'ethereum',
        chain: 'ETH',
        type: ASSET_TYPE_COIN,
        decimals: 18,
        contract: null,
        privKey: null,
        walletAddress: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: 0,
        active: true,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        version: applicationProperties.newAssetDescriptorVersion,
    },
    {
        symbol: 'BNB',
        name: 'Binance Coin',
        cid: 'binancecoin',
        chain: 'BSC',
        type: ASSET_TYPE_COIN,
        decimals: 18,
        contract: null,
        privKey: null,
        walletAddress: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: 0,
        active: true,
        image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
        version: applicationProperties.newAssetDescriptorVersion,
    },
    {
        symbol: 'MATIC',
        name: 'Matic',
        cid: 'matic-network',
        chain: 'POLYGON',
        type: ASSET_TYPE_COIN,
        decimals: 18,
        contract: null,
        privKey: null,
        walletAddress: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: 0,
        active: true,
        image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
        version: applicationProperties.newAssetDescriptorVersion,
    },
];

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
export const COIN_LIST = [
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
        symbol: 'USDT',
        name: 'Tether USD',
        cid: 'binancecoin',
        chain: 'BSC',
        type: ASSET_TYPE_TOKEN,
        decimals: 18,
        contract: '0x55d398326f99059fF775485246999027B3197955',
        privKey: null,
        walletAddress: null,
        balance: 0,
        unconfirmedBalance: 0,
        value: 0,
        price: 0,
        active: true,
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        version: applicationProperties.newAssetDescriptorVersion,
    },
    {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        cid: 'binancecoin',
        chain: 'BSC',
        type: ASSET_TYPE_TOKEN,
        decimals: 18,
        contract: '0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA',
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
];

process.env.TESTNET = true;
export const applicationProperties = {
    defaultTheme: {
        code: 'light',
        icon: 'Light',
        name: 'Light',
    },
    themes: [
        {
            code: 'dark',
            icon: 'Dark',
            name: 'Dark',
        },
        {
            code: 'light',
            icon: 'Light',
            name: 'Light',
        },
    ],
    appVersion: '1.3.7 (52)',
    buildNumber: 52,
    defaultDerivationKey: 0,
    pinAndroidTimeout: 180, // seconds
    balanceTimeout: 10, // seconds
    newAssetDescriptorVersion: 1,
    covalentKey: 'ckey_20124a251b804bd4b570908e3f4',
    openSeaKey: '',
    migrationKey: '@MIGRATION_KEY',
    initKey: '@INIT',
    oneSignalKey: '',
    swapFee: 0, // 0%
    feeRecipient: '',
    endPoints: {
        btc: 'https://www.blockchain.com/btc-testnet/',
        eth: 'https://ropsten.etherscan.io/',
        bsc: 'https://testnet.bscscan.com/',
        polygon: 'https://mumbai.polygonscan.com/',
        app: 'https://api.coingrig.com/app/',
        news: 'https://api.coingrig.com/news/',
        ramper: 'https://buy.ramp.network/?hostAppName=Coingrig&variant=mobile',
        coingecko: 'https://api.coingecko.com/api/v3',
        covalent: 'https://api.covalenthq.com/v1',
        opensea: 'https://api.opensea.io/api/v1',
        assets: 'https://assets.coingrig.com/',
    },
};

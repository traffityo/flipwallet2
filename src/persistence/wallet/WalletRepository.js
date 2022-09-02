import BigNumber from 'bignumber.js';
import {WalletFactory} from '@coingrig/core';
import {Logs} from '@modules/log/logs';
import axios from 'axios';
import {applicationProperties} from '@src/application.properties';
import {
    CHAIN_ID_MAP,
    CHAIN_ID_TYPE_MAP,
    WALLET_LIST_KEY,
} from '@persistence/wallet/WalletConstant';
import {StorageService} from '@modules/storage/StorageService';
import {MarketService} from '@persistence/market/MarketService';

let lastFetchedBalance = 0;

export const WalletRepository = {
    getAccountBalance,
};

async function getAccountBalance() {
    const wallets = await StorageService.StorageGetItem(
        WALLET_LIST_KEY,
        true,
        true,
    );
    const tokens = await getTokenBalancesByWallets(wallets);
    for (let i = 0; i < wallets.length; i++) {
        let contract = wallets[i].contract?.toLowerCase() ?? null;
        let token = tokens.find(o => o.contract === contract);
        if (contract && token !== undefined) {
            Logs.info('Balance from provider', wallets[i].symbol);
            //Set token balance and token price
            const balance = Number(
                new BigNumber(token.balance).div(10 ** token.decimals),
            );
            const price = token.rate;
            wallets[i].balance = balance;
            wallets[i].price = price;
            wallets[i].value = balance * price;
        } else {
            Logs.info('Balance from @core', wallets[i].symbol);
            const coinIds = wallets.map(o => {
                return o.cid;
            });
            //{ eth : 1800 , btc : 90000}
            const coinPrices = await MarketService.getCoinsByList(coinIds);
            const price = coinPrices[wallets[i].cid.toLowerCase()]?.usd ?? null;
            if (price !== null) {
                wallets[i].price = parseFloat(price);
            }
            let signer = WalletFactory.getWallet(wallets[i]);
            const currentBalance = await signer.getBalance();
            const unconfirmedBalance = currentBalance.getUnconfirmedBalance();
            const balance = currentBalance.getValue();
            wallets[i].balance = balance;
            wallets[i].price = price;
            wallets[i].value = balance * price;
            wallets[i].unconfirmedBalance = unconfirmedBalance;
        }
    }
    return wallets;
}

async function getTokenBalancesByWallets(wallets) {
    Logs.info('Start: getTokenBalancesByWallets: ' + JSON.stringify(wallets));
    const tokens = [];
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i];
        if (!CHAIN_ID_MAP[wallet.chain]) {
            continue;
        }
        const url = `${applicationProperties.endPoints.covalent}/${
            CHAIN_ID_MAP[wallet.chain]
        }/address/${wallet.walletAddress}/balances_v2/?key=${
            applicationProperties.covalentKey
        }`;
        const {data, status} = await axios.get(url, {timeout: 2000});
        if (status === 200) {
            const token = data.data;
            const chain = token.chain_id;
            const items = token.items;
            for (let i = 0; i < items.length; i++) {
                tokens.push({
                    chain: CHAIN_ID_TYPE_MAP[chain],
                    contract: items[i].contract_address.toLowerCase(),
                    decimals: items[i].contract_decimals,
                    balance: items[i].balance,
                    rate: items[i].quote_rate,
                });
            }
        }
    }
    Logs.info('End: getTokenBalanceByAddress: ' + JSON.stringify(tokens));
    return tokens;
}

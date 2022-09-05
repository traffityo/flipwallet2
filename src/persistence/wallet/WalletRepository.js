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
import moment from 'moment';
import convert from 'ether-converter';

export const WalletRepository = {
    getAccountBalance,
    getTokenTransactionsByWallet,
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
        if (contract) {
            Logs.info('Balance from provider', wallets[i].symbol);
            if (token !== undefined) {
                //Set token balance and token price
                const balance = Number(
                    new BigNumber(token.balance).div(10 ** token.decimals),
                );
                const price = token.rate;
                wallets[i].balance = balance;
                wallets[i].price = price;
                wallets[i].value = balance * price;
            } else {
                wallets[i].balance = 0;
                wallets[i].price = 0;
                wallets[i].value = 0;
            }
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
        const {data, status} = await axios.get(url, {
            timeout: 2000,
        });
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

async function getTokenTransactionsByWallet(wallet) {
    Logs.info('Start: getTransactionsByWallet: ' + JSON.stringify(wallet));
    let transactions = [];
    const url = `${applicationProperties.endPoints.binance}?module=account&action=tokentx&contractaddress=${wallet.contract}&address=${wallet.walletAddress}&page=1&offset=30&startblock=0&endblock=27025780&sort=desc&apikey=DI5F6DDAVHJHHNE3HH8SF7UTP2R4D7PTBU`;
    Logs.info(url);
    const {data, status} = await axios.get(url, {
        timeout: 2000,
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        },
    });
    console.log(data);
    if (status == 200) {
        const {status, message, result} = data;
        if (status === '1') {
            for (let i = 0; i < result.length; i++) {
                const item = {...result[i]};
                item.sender =
                    item.from.toUpperCase() ==
                    wallet.walletAddress.toUpperCase()
                        ? true
                        : false;
                item.status =
                    item.isError == '1'
                        ? '-1'
                        : item.txreceipt_status == '0'
                        ? '0'
                        : '1';
                item.icon =
                    item.from.toUpperCase() ==
                    wallet.walletAddress.toUpperCase()
                        ? require('@assets/send.png')
                        : require('@assets/receive.png');
                item.date = moment(item.timeStamp, 'X').fromNow();
                item.etherValue = convert(item.value, 'wei').ether;
                item.etherGasValue = convert(
                    item.gasPrice * item.gas,
                    'wei',
                ).ether;
                transactions.push(item);
            }
        }
    }
    Logs.info(
        'End: getTokenTransactionsByWallet: ' + JSON.stringify(transactions),
    );
    return transactions;
}

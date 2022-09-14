import {applicationProperties} from '@src/application.properties';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import {WalletService} from '@persistence/wallet/WalletService';

export const TokenService = {
    getTokenBalance,
};

async function getTokenBalance(token) {
    token.balance = 0;
    token.rate = 0;
    const wallet = await WalletService.getWalletByChainId(token.chainId);
    if (wallet.success) {
        const url = `${applicationProperties.endPoints.covalent}/${token.chainId}/address/${wallet.data.walletAddress}/balances_v2/?key=${applicationProperties.covalentKey}`;
        try {
            const {data, status} = await axios.get(url, {
                timeout: 2000,
            });
            if (status === 200) {
                const resData = data.data;
                const items = resData.items;
                for (let i = 0; i < items.length; i++) {
                    if (
                        items[i].contract_address.toLowerCase() ===
                        token.address.toLowerCase()
                    ) {
                        const balance = Number(
                            new BigNumber(items[i].balance).div(
                                10 ** items[i].decimals,
                            ),
                        );
                        token.balance = balance;
                        token.rate = items[i].quote_rate;
                        break;
                    }
                }
            }
            return token;
        } catch (e) {
            console.log(e);
            return token;
        }
    } else {
        return {};
    }
}

import {Logs} from '@modules/log/logs';

export const MarketService = {
    getCoinsByList,
    getTopCoins,
};

function getCoinsByList(list) {
    return getCoins(list);
}

async function getTopCoins(limit) {
    try {
        const coins = await getAllCoins(limit, true);
        return {
            success: true,
            data: coins,
        };
    } catch (e) {
        Logs.error('End: getTopCoins: ' + e.message);
        return {
            success: false,
            data: [],
        };
    }
}

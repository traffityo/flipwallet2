import {MarketService} from '@persistence/market/MarketService';
import {getTopCoinsSuccess} from '@persistence/market/MarketReducer';

export const MarketAction = {
    getTopCoins,
};

function getTopCoins(limit) {
    return async dispatch => {
        const {success, data} = await MarketService.getTopCoins(limit);
        if (success) {
            dispatch(getTopCoinsSuccess(data));
        }
        return {success, data};
    };
}

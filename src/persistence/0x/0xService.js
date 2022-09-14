import axios from 'axios';

export const OxService = {
    getQuote,
};

let APP_URI = {
    ETH: 'https://api.0x.org/swap/v1',
    BSC: 'https://bsc.api.0x.org/swap/v1',
    POLYGON: 'https://polygon.api.0x.org/swap/v1',
};

async function getQuote(chain, params) {
    let url = `${APP_URI[chain]}/quote`;
    console.log(url);
    console.log(params);
    let response = null;
    try {
        response = await axios.get(url, {
            params: params,
        });
    } catch (ex) {
        console.log(ex.response.data);
        if (ex.response && ex.response.data) {
            throw ex.response.data.reason;
        }
    }
    return response?.data || null;
}

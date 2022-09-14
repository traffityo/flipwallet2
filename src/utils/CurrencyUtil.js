import BigNumber from 'bignumber.js';
import i18next from 'i18next';

export const formatPrice = (nr, limitDigits = false) => {
    if (nr === 0 || isNaN(nr)) {
        return '$0';
    }
    if (limitDigits) {
        const bgn = new BigNumber(nr);
        if (bgn.isLessThan(new BigNumber(1e-2))) {
            return '\u2248 $0.00'; // ≈ unicode
        }
    }
    let newNr = i18next.format(nr, '$0,0[.][00]');
    if (newNr === '$NaN' || newNr === '$0') {
        newNr = '$' + nr;
    }
    return newNr;
};
export const formatCoins = nr => {
    if (isNaN(nr)) {
        return '-';
    }
    const newNr = new BigNumber(nr);
    return Number(newNr.toFixed(4));
};
export const formatNumber = nr => {
    return i18next.format(nr, '0,0.[00]a');
};
export const formatNoComma = (nr: string) => {
    return nr.replace(/,/g, '.');
};
export const formatPercentage = nr => {
    if (isNaN(nr)) {
        return '-';
    }
    const newNr = new BigNumber(nr);
    const isUp = newNr >= 0;
    const number = Number(newNr.toFixed(2));
    if (isUp) {
        return '+' + number + '%';
    }
    return number + '%';
};
export const toWei = (amount, decimals) => {
    return Number(new BigNumber(amount).multipliedBy(10 ** decimals));
};

export const toEth = (amount, decimals) => {
    return String(new BigNumber(amount).div(10 ** decimals));
};

export const calcFee = (gas, gasPrice) => {
    return Number(new BigNumber(gas).multipliedBy(gasPrice));
};

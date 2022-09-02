import * as React from 'react';
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import CommonText from '@components/commons/CommonText';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useSelector} from 'react-redux';
import {formatPrice} from '@src/utils/CurrencyUtil';

function Balance() {
    const [active, setActive] = useState(false);
    const {totalBalance} = useSelector(state => state.WalletReducer);
    return (
        <CommonTouchableOpacity
            style={styles.balanceContainer}
            onPress={() => {
                setActive(!active);
            }}>
            <Icon
                type={Icons.FontAwesome5}
                name={active ? 'eye' : 'eye-slash'}
                size={18}
            />
            <CommonText style={styles.balanceText}>
                {active ? formatPrice(totalBalance) : '*******'}
            </CommonText>
        </CommonTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    balanceContainer: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        marginLeft: 5,
        fontSize: 18,
    },
});

export default Balance;

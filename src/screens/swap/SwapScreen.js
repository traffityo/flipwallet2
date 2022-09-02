import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {WalletAction} from '@persistence/wallet/WalletAction';

export default function SwapScreen({navigation, route}) {
    const {wallets, totalBalance} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            dispatch(WalletAction.getAccountBalance());
        })();
    }, []);
    return <SafeAreaView style={[styles.container]}></SafeAreaView>;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 50,
        paddingRight: 5,
    },
    header: {
        height: 100,
        width: '100%',
    },
});

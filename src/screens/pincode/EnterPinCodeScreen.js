import React, {useEffect} from 'react';
import {PinCode} from '@components/PinCode';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {UserAction} from '@persistence/user/UserAction';
import {useDispatch} from 'react-redux';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {useNavigation} from '@react-navigation/native';

const EnterPinCodeScreen = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const navigation = useNavigation();
    useEffect(() => {}, []);

    const success = async () => {
        DeviceEventEmitter.emit('showDoor', {
            title: t('modal.please_wait'),
            body: t('modal.remember_to_backup'),
        });
        dispatch(WalletAction.getWallets()).then(() => {
            dispatch(WalletAction.getAccountBalance()).then(() => {});
            dispatch(UserAction.signIn()).then(() => {
                DeviceEventEmitter.emit('hideDoor');
            });
        });
    };

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <CommonTouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Icon type={Icons.Feather} name={'arrow-left'} />
                </CommonTouchableOpacity>
            </View>
            <PinCode onSuccess={() => success()} status={'enter'} />
        </View>
    );
};
const styles = StyleSheet.create({
    header: {
        height: 48,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
export default EnterPinCodeScreen;

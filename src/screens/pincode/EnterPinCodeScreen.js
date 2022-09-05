import React, {useEffect} from 'react';
import {PinCode} from '@components/PinCode';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {UserAction} from '@persistence/user/UserAction';
import {useDispatch} from 'react-redux';
import {DeviceEventEmitter} from 'react-native';
import {useTranslation} from 'react-i18next';

const EnterPinCodeScreen = () => {
    const dispatch = useDispatch();
    useEffect(() => {}, []);
    const {t} = useTranslation();
    const success = async () => {
        DeviceEventEmitter.emit('showDoor', {
            title: t('modal.please_wait'),
            body: t('modal.remember_to_backup'),
        });
        dispatch(WalletAction.getWallets()).then(() => {
            dispatch(WalletAction.getAccountBalance()).then(() => {
                dispatch(UserAction.signIn()).then(() => {
                    DeviceEventEmitter.emit('hideDoor');
                });
            });
        });
    };

    return <PinCode onSuccess={() => success()} status={'enter'} />;
};

export default EnterPinCodeScreen;

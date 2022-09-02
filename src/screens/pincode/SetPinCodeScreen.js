import React, {useEffect} from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {PinCode} from '@components/PinCode';
import {DeviceEventEmitter} from 'react-native';
import {useTranslation} from 'react-i18next';
import {sleep} from '@src/utils/ThreadUtil';
import {generateMnemonic} from '@coingrig/wallet-generator';
import {WalletGenerator} from '@coingrig/core';
import {COIN_LIST} from '@persistence/wallet/WalletConstant';
import {showMessage} from 'react-native-flash-message';
import {useDispatch} from 'react-redux';
import {UserAction} from '@persistence/user/UserAction';
import {WalletAction} from '@persistence/wallet/WalletAction';

const SetPinScreen = ({route}) => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {}, []);

    const success = async () => {
        const goTo = route.params.new
            ? 'GenerateWalletScreen'
            : 'ImportWalletScreen';

        if (goTo === 'GenerateWalletScreen') {
            DeviceEventEmitter.emit('showDoor', {
                title: t('modal.please_wait'),
                body: t('modal.remember_to_backup'),
            });
            await sleep(500);
            let newMnemonic;
            try {
                const words = 12; // or 24
                newMnemonic = await generateMnemonic(words);
            } catch (error) {
                newMnemonic = WalletGenerator.generateMnemonic();
            }
            await createWallet(newMnemonic);
            return;
        }
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{name: goTo}],
            }),
        );
    };
    const createWallet = async mnemonic => {
        dispatch(WalletAction.createWallets(mnemonic, COIN_LIST)).then(
            ({success}) => {
                if (success) {
                    dispatch(UserAction.signIn()).then(() => {
                        DeviceEventEmitter.emit('hideDoor');
                    });
                } else {
                    showMessage({
                        message: t('message.error.unable_to_create_wallets'),
                        type: 'danger',
                    });
                }
            },
        );
    };
    return (
        <PinCode
            onFail={() => {
                console.log('Fail to auth');
            }}
            onSuccess={() => success()}
            onClickButtonLockedPage={() => console.log('Quit')}
            status={'choose'}
        />
    );
};

export default SetPinScreen;

import React, {useEffect} from 'react';
import {PinCode} from '@components/PinCode';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {UserAction} from '@persistence/user/UserAction';
import {useDispatch} from 'react-redux';

const EnterPinCodeScreen = () => {
    const dispatch = useDispatch();
    useEffect(() => {}, []);

    const success = async () => {
        dispatch(WalletAction.getWallets()).then(() => {
            dispatch(UserAction.signIn());
        });
    };

    return <PinCode onSuccess={() => success()} status={'enter'} />;
};

export default EnterPinCodeScreen;

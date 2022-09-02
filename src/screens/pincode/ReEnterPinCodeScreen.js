import React from 'react';
import {PinCode} from '@components/PinCode';

const ReEnterPinCodeScreen = ({navigation}) => {
    return (
        <PinCode
            onSuccess={() => {
                navigation.goBack();
            }}
            status={'enter'}
        />
    );
};

export default ReEnterPinCodeScreen;

import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {enableScreens} from 'react-native-screens';
import {LogBox} from 'react-native';
import ReduxStore from '@modules/redux/ReduxStore';
import ApplicationNavigator from '@modules/navigation/ApplicationNavigator';
import '@modules/i18n/i18n';

enableScreens();
LogBox.ignoreLogs(['Warning: Cannot']);
LogBox.ignoreLogs(['component']);
LogBox.ignoreLogs(['Clipboard']);
LogBox.ignoreLogs(['TouchID']);
LogBox.ignoreLogs(['RCTUI']);
LogBox.ignoreLogs(['[auth/p']);
LogBox.ignoreLogs(['[User cancelled the login process']);
LogBox.ignoreLogs(['Require cycles are allowed']);
LogBox.ignoreLogs(['Setting a timer for a long']);
LogBox.ignoreLogs(['formState.isValid']);
LogBox.ignoreLogs(['RCTBridge required dispatch_sync']);
LogBox.ignoreLogs(['View']);
LogBox.ignoreLogs(['AsyncStorage']);
LogBox.ignoreLogs(['Require cycle: node_modules/react-native-crypto/ind']);
LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);

export default function App() {
    useEffect(() => {});
    return (
        <Provider store={ReduxStore}>
            <ApplicationNavigator />
        </Provider>
    );
}

import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import ReEnterPinCodeScreen from '@screens/pincode/ReEnterPinCodeScreen';
import {AppState} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WalletDetailScreen from '@screens/wallet/WalletDetailScreen';
import WalletReceiveScreen from '@screens/wallet/WalletReceiveScreen';
import WalletSendScreen from '@screens/wallet/WalletSendScreen';
import WalletBuyScreen from '@screens/wallet/WalletBuyScreen';
import WalletTransactionScreen from '@screens/wallet/WalletTransactionScreen';
import WalletTransactionDetailScreen from '@screens/wallet/WalletTransactionDetailScreen';
import TokenScreen from '@screens/token/TokenScreen';
import BottomTabBarNavigator from '@modules/navigation/BottomTabBarNavigator';

const Stack = createStackNavigator();

function MainStackNavigator() {
    const navigation = useNavigation();
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            nextAppState => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    navigation.navigate('ReEnterPinCodeScreen');
                    console.log('App has come to the foreground!');
                }
                appState.current = nextAppState;
                setAppStateVisible(appState.current);
                console.log('AppState', appState.current);
            },
        );

        return () => {
            subscription.remove();
        };
    }, []);
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen
                name="BottomTabBarNavigator"
                component={BottomTabBarNavigator}
            />
            <Stack.Screen
                name="ReEnterPinCodeScreen"
                component={ReEnterPinCodeScreen}
            />
            <Stack.Screen
                name="WalletDetailScreen"
                component={WalletDetailScreen}
            />
            <Stack.Screen
                name="WalletReceiveScreen"
                component={WalletReceiveScreen}
            />
            <Stack.Screen
                name="WalletSendScreen"
                component={WalletSendScreen}
            />
            <Stack.Screen name="WalletBuyScreen" component={WalletBuyScreen} />
            <Stack.Screen
                name="WalletTransactionScreen"
                component={WalletTransactionScreen}
            />
            <Stack.Screen
                name="WalletTransactionDetailScreen"
                component={WalletTransactionDetailScreen}
            />
            <Stack.Screen name="TokenScreen" component={TokenScreen} />
        </Stack.Navigator>
    );
}

export default MainStackNavigator;

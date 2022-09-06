import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import StartScreen from '@screens/auth/StartScreen';
import SetPinCodeScreen from '@screens/pincode/SetPinCodeScreen';
import SplashScreen from '@screens/splash/SplashScreen';
import EnterPinCodeScreen from '@screens/pincode/EnterPinCodeScreen';
import ImportScreen from '@screens/auth/ImportScreen';

const Stack = createStackNavigator();

function AuthenticationStackNavigator() {
    useEffect(() => {}, []);
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen
                name="SetPinCodeScreen"
                component={SetPinCodeScreen}
            />
            <Stack.Screen
                name="EnterPinCodeScreen"
                component={EnterPinCodeScreen}
            />
            <Stack.Screen name="ImportScreen" component={ImportScreen} />
        </Stack.Navigator>
    );
}

export default AuthenticationStackNavigator;

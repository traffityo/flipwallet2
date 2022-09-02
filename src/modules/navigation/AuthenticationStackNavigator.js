import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import IntroScreen from '@screens/auth/IntroScreen';
import StartScreen from '@screens/auth/StartScreen';
import SetPinCodeScreen from '@screens/pincode/SetPinCodeScreen';
import SplashScreen from '@screens/splash/SplashScreen';
import EnterPinCodeScreen from '@screens/pincode/EnterPinCodeScreen';

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
            <Stack.Screen name="IntroScreen" component={IntroScreen} />
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen
                name="SetPinCodeScreen"
                component={SetPinCodeScreen}
            />
            <Stack.Screen
                name="EnterPinCodeScreen"
                component={EnterPinCodeScreen}
            />
        </Stack.Navigator>
    );
}

export default AuthenticationStackNavigator;

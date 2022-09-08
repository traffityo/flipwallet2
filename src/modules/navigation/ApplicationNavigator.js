import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationStackNavigator from '@modules/navigation/AuthenticationStackNavigator';
import {withTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import BottomTabBarNavigator from '@modules/navigation/BottomTabBarNavigator';

function ApplicationNavigator() {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {loggedIn} = useSelector(state => state.UserReducer);

    return (
        <NavigationContainer
            theme={{
                colors: {
                    background: theme.background,
                },
            }}>
            {loggedIn ? (
                <BottomTabBarNavigator />
            ) : (
                <AuthenticationStackNavigator />
            )}
        </NavigationContainer>
    );
}

export default withTranslation()(ApplicationNavigator);

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationStackNavigator from '@modules/navigation/AuthenticationStackNavigator';
import {withTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import EntrySlide from '@components/EntrySlide';
import MainStackNavigator from '@modules/navigation/MainStackNavigator';
import FlashMessage from 'react-native-flash-message';

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
                <MainStackNavigator />
            ) : (
                <AuthenticationStackNavigator />
            )}
            <EntrySlide />
            <FlashMessage position="top" />
        </NavigationContainer>
    );
}

export default withTranslation()(ApplicationNavigator);

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationStackNavigator from '@modules/navigation/AuthenticationStackNavigator';
import {withTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {StyleSheet} from 'react-native';
import MainStackNavigator from '@modules/navigation/MainStackNavigator';

function ApplicationNavigator() {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {loggedIn} = useSelector(state => state.UserReducer);

    return (
        <NavigationContainer
            theme={{
                colors: {
                    background: '#03050c',
                },
            }}>
            {loggedIn ? (
                <MainStackNavigator />
            ) : (
                <AuthenticationStackNavigator />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    gradient: {
        width: '100%',
        height: '100%',
    },
});
export default withTranslation()(ApplicationNavigator);

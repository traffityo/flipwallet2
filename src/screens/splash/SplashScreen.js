import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {StorageService} from '@modules/storage/StorageService';
import {applicationProperties} from '@src/application.properties';
import _ from 'lodash';
import CommonImage from '@components/commons/CommonImage';
import {CommonActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen({navigation}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    useEffect(() => {
        (async () => {
            //await StorageService.StorageClearAll();
            const isInitialized = await StorageService.StorageGetItem(
                applicationProperties.initKey,
                true,
            );
            if (!_.isNil(isInitialized)) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [{name: 'EnterPinCodeScreen'}],
                    }),
                );
            } else {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [{name: 'StartScreen'}],
                    }),
                );
            }
        })();
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <CommonImage
                    style={{height: 75, tintColor: '#353333'}}
                    resizeMode="contain"
                    source={require('@assets/logo.png')}
                />
            </LinearGradient>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: 40,
        letterSpacing: 1,
    },
    gradient: {
        width: '100%',
        height: '110%',
    },
});

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {StorageService} from '@modules/storage/StorageService';
import {applicationProperties} from '@src/application.properties';
import _ from 'lodash';
import CommonImage from '@components/commons/CommonImage';
import {CommonActions} from '@react-navigation/native';

export default function SplashScreen({navigation}) {
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
            <CommonImage
                style={{height: 75, tintColor: '#353333'}}
                resizeMode="contain"
                source={require('@assets/logo.png')}
            />
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
        fontFamily: 'RobotoSlab-Bold',
        fontSize: 40,
        letterSpacing: 1,
    },
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import CommonImage from '@components/commons/CommonImage';
import CommonText from '@components/commons/CommonText';
import CommonButton from '@components/commons/CommonButton';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

export default function StartScreen() {
    const {t} = useTranslation();
    const navigation = useNavigation();
    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <CommonImage
                        source={require('@assets/bg.png')}
                        style={{width: '100%', height: 575}}
                        resizeMode={'stretch'}
                    />
                    <CommonImage
                        source={require('@assets/blur.png')}
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                        }}
                        resizeMode={'stretch'}
                    />
                </View>
                <View
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#172640',
                        opacity: 0.2,
                    }}></View>
                <View style={styles.buttonContainer}>
                    <CommonText style={styles.title}>
                        {t('start.create_wallet')}
                    </CommonText>
                    <CommonText style={styles.desc}>
                        Get a real sense about the wallet you're interested in
                        first
                    </CommonText>
                    <View style={{width: '70%', marginTop: 20}}>
                        <CommonButton
                            text={t('start.let_go')}
                            onPress={() => {
                                navigation.navigate('SetPinCodeScreen', {
                                    new: true,
                                });
                            }}
                        />
                    </View>
                    <CommonText style={styles.desc}>
                        {t('start.import_wallet')}
                    </CommonText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        flex: 1,
    },
    buttonContainer: {
        height: 300,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 34,
        fontWeight: 'bold',
    },
    desc: {
        marginTop: 20,
        color: '#9f9f9f',
        fontSize: 18,
        textAlign: 'center',
    },
});

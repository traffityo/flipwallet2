import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import CommonImage from '@components/commons/CommonImage';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonButton from '@components/commons/CommonButton';

const StartScreen = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View>
                    <CommonImage
                        style={{height: 75, tintColor: theme.foreground}}
                        resizeMode="contain"
                        source={require('@assets/logo.png')}
                    />
                </View>
                <CommonText style={[styles.logo, {color: theme.foreground}]}>
                    VCoin
                </CommonText>
                <CommonText style={[styles.subtitle, {color: theme.lighter}]}>
                    {t('brand.message')}
                </CommonText>
            </View>
            <View style={styles.bottomContainer}>
                <CommonButton
                    text={t('init.new_wallet')}
                    backgroundColor={'#26A17B'}
                    color={theme.background}
                    onPress={async () => {
                        //await StorageService.StorageClearAll();
                        navigation.navigate('SetPinCodeScreen', {new: true});
                    }}
                />
                <CommonButton
                    text={t('init.import_wallet')}
                    backgroundColor={theme.background}
                    color={theme.foreground}
                    onPress={() =>
                        navigation.navigate('SetPinCodeScreen', {new: false})
                    }
                />
            </View>
            <Svg
                viewBox="0 0 400 150"
                preserveAspectRatio="none"
                style={styles.waves}>
                <Path
                    d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
                    fill={theme.waveborder}
                    opacity="0.9"
                />
            </Svg>
            <Svg
                viewBox="0 0 400 150"
                preserveAspectRatio="none"
                style={styles.waves2}>
                <Path
                    d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
                    fill={theme.darker}
                    // opacity="0.7"
                />
            </Svg>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(220,246,246,1)',
    },
    waves: {
        height: '70%',
        width: '150%',
        margin: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: -5,
    },
    waves2: {
        height: '69%',
        width: '160%',
        margin: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: -5,
    },
    logo: {
        fontFamily: 'RobotoSlab-Light',
        fontSize: 19,
        letterSpacing: 1,
        marginTop: 20,
    },
    topContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        marginBottom: 40,
    },
    subtitle: {
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 13,
    },
});
export default StartScreen;

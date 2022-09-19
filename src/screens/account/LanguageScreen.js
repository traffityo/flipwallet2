import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonImage from '@components/commons/CommonImage';
import i18n from 'i18next';
import {StorageService} from '@modules/storage/StorageService';

export default function LanguageScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {})();
    }, []);
    const setLanguage = async lng => {
        await i18n.changeLanguage(lng);
        await StorageService.StorageSetItem('@lng', lng, false);
        navigation.goBack();
    };
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <View style={styles.header}>
                    <View style={styles.headerPriceContainer}>
                        <CommonBackButton
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    </View>
                    <CommonText>{t('language.choose_language')}</CommonText>
                    <View style={styles.headerPriceContainer}></View>
                </View>
                <View style={styles.content}>
                    <CommonTouchableOpacity
                        style={styles.item}
                        onPress={() => setLanguage('en')}>
                        <CommonImage
                            style={{height: 25, width: 25}}
                            resizeMode="contain"
                            source={require('@assets/countries/usa.png')}
                        />
                        <CommonText style={styles.textItem}>
                            {t('language.english')}
                        </CommonText>
                    </CommonTouchableOpacity>
                    <CommonTouchableOpacity
                        style={styles.item}
                        onPress={() => setLanguage('fr')}>
                        <CommonImage
                            style={{height: 25, width: 25}}
                            resizeMode="contain"
                            source={require('@assets/countries/france.png')}
                        />
                        <CommonText style={styles.textItem}>
                            {t('language.french')}
                        </CommonText>
                    </CommonTouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        marginTop: 15,
    },
    header: {
        height: 42,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerPriceContainer: {
        width: 70,
    },
    item: {
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    textItem: {marginLeft: 10, flex: 3},
});

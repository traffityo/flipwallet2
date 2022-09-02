import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useTranslation} from 'react-i18next';
import {CommonActions} from '@react-navigation/native';
import Privacy from '@assets/svg/sec.svg';
import Rocket from '@assets/svg/rocket.svg';
import Finance from '@assets/svg/market.svg';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';

export default function IntroScreen({navigation}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const pw = useRef(null);
    const {t} = useTranslation();
    const [position, setPosition] = useState(0);
    const pageSelected = ev => {
        setPosition(ev.nativeEvent.position);
    };
    const nextPage = () => {
        const nextPosition = position + 1;
        if (nextPosition >= 3) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{name: 'StartScreen'}],
                }),
            );
            return;
        }
        pw.current?.setPage(nextPosition);
    };
    useEffect(() => {
        (async () => {})();
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <PagerView
                ref={pw}
                style={styles.pager}
                initialPage={position}
                showPageIndicator
                onPageSelected={e => pageSelected(e)}>
                <View key="1" style={styles.pagerView}>
                    <Privacy width={280} height={350} />
                    <CommonText
                        style={[styles.desc, {color: theme.foreground}]}>
                        {t('onboarding.text1')}
                    </CommonText>
                </View>
                <View key="2" style={styles.pagerView}>
                    <Rocket width={280} height={350} />
                    <CommonText
                        style={[styles.desc, {color: theme.foreground}]}>
                        {t('onboarding.text2')}
                    </CommonText>
                </View>
                <View key="3" style={styles.pagerView}>
                    <Finance width={230} height={350} />
                    <CommonText
                        style={[styles.desc, {color: theme.foreground}]}>
                        {t('onboarding.text3')}
                    </CommonText>
                </View>
            </PagerView>
            <View style={styles.footer}>
                <CommonTouchableOpacity
                    onPress={nextPage}
                    style={[
                        styles.button,
                        {backgroundColor: theme.foreground},
                    ]}>
                    <CommonText
                        style={[styles.text, {color: theme.background}]}>
                        {t('onboarding.next')}
                    </CommonText>
                </CommonTouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pager: {
        flex: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    pagerView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    desc: {
        fontSize: 20,
        textAlign: 'center',
        marginHorizontal: 30,
        fontFamily: 'RobotoSlab-Regular',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 20,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
});

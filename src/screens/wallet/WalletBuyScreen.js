import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import {useTranslation} from 'react-i18next';
import {formatPrice} from '@src/utils/CurrencyUtil';
import {useBackHandler} from '@react-native-community/hooks';
import CommonLoading from '@components/commons/CommonLoading';
import {applicationProperties} from '@src/application.properties';
import WebView from 'react-native-webview';

export default function WalletTransactionDetailScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {coin} = route.params;
    const webview = useRef();
    const [canGoBack, setCanGoBack] = useState(false);
    const [url, setUrl] = useState('');
    useBackHandler(() => {
        if (canGoBack) {
            webview.current.goBack();
        } else {
            navigation.goBack();
        }
        return true;
    });
    const onNavigationStateChange = webViewState => {
        setCanGoBack(webViewState.canGoBack);
    };
    useEffect(() => {
        CommonLoading.show();
        let asset = coin.symbol.toUpperCase();
        if (asset === 'BNB') {
            asset = 'BSC_BNB';
        }
        const link =
            applicationProperties.endPoints.ramper +
            '&userAddress=' +
            coin.walletAddress +
            '&swapAsset=' +
            asset;
        setUrl(link);
    }, []);
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
                    <CommonText>{coin.name}</CommonText>
                    <View style={styles.headerPriceContainer}>
                        <CommonText
                            style={styles.headerPriceText}
                            numberOfLines={1}>
                            {formatPrice(coin.price)}
                        </CommonText>
                    </View>
                </View>
                <View style={styles.content}>
                    <WebView
                        ref={webview}
                        source={{
                            uri: url,
                        }}
                        originWhitelist={['*']}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={true}
                        showsVerticalScrollIndicator={false}
                        onLoad={syntheticEvent => {
                            CommonLoading.hide();
                        }}
                        onNavigationStateChange={onNavigationStateChange}
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 42,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        height: '100%',
        padding: 10,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
});

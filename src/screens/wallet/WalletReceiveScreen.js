import React, {useEffect} from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {useTranslation} from 'react-i18next';
import {formatPrice} from '@src/utils/CurrencyUtil';
import QRCode from 'react-native-qrcode-svg';
import Tooltip from 'react-native-walkthrough-tooltip';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';

export default function WalletReceiveScreen({navigation, route}) {
    const {coin} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const copyToClipboard = async data => {
        await Clipboard.setString(data);
    };
    const shareAddress = async () => {
        await Share.open({
            title: '',
            message: coin.walletAddress,
        });
    };
    useEffect(() => {
        (async () => {})();
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
                <ScrollView>
                    <View style={styles.content}>
                        <View
                            style={[
                                styles.qrCode,
                                {backgroundColor: theme.gradientSecondary},
                            ]}>
                            <View style={styles.qrCodeHeader}></View>
                            <QRCode
                                value={coin.walletAddress}
                                size={240}
                                backgroundColor={'white'}
                            />
                            <View style={styles.qrCodeFooter}>
                                <CommonText
                                    style={styles.text}
                                    numberOfLines={1}
                                    ellipsizeMode="middle">
                                    {coin.walletAddress}
                                </CommonText>
                            </View>
                        </View>
                        <View style={styles.description}>
                            <CommonText style={styles.text}>
                                {t('wallet.receive.sendOnly')} {coin.symbol}{' '}
                                {t('wallet.receive.toThisAddress')}
                            </CommonText>
                            <CommonText style={styles.text}>
                                {t('wallet.receive.sendingAnyOtherCoins')}
                            </CommonText>
                        </View>
                        <View style={styles.controls}>
                            <CommonTouchableOpacity
                                style={styles.element}
                                onPress={async () => {
                                    await copyToClipboard(coin.walletAddress);
                                    setTooltipVisible(true);
                                    setTimeout(() => {
                                        setTooltipVisible(false);
                                    }, 1000);
                                }}>
                                <View style={[styles.elementIcon]}>
                                    <Tooltip
                                        isVisible={tooltipVisible}
                                        content={
                                            <CommonText
                                                style={{color: 'black'}}>
                                                {t(
                                                    'wallet.receive.addressCopied',
                                                )}
                                            </CommonText>
                                        }
                                        placement="top"
                                        onClose={() => {}}>
                                        <Icon
                                            type={Icons.Ionicons}
                                            name={'copy'}
                                            size={19}
                                        />
                                    </Tooltip>
                                </View>
                                <CommonText>
                                    {t('wallet.receive.copy')}
                                </CommonText>
                            </CommonTouchableOpacity>
                            <CommonTouchableOpacity
                                style={styles.element}
                                onPress={async () => {
                                    await shareAddress();
                                }}>
                                <View style={[styles.elementIcon]}>
                                    <Icon
                                        type={Icons.FontAwesome}
                                        name={'share'}
                                        size={19}
                                    />
                                </View>
                                <CommonText>
                                    {t('wallet.receive.share')}
                                </CommonText>
                            </CommonTouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
        height: Dimensions.get('window').height - 158,
        marginTop: 20,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    qrCode: {
        minHeight: 280,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 3,
        borderRadius: 10,
    },
    qrCodeHeader: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrCodeFooter: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    description: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controls: {
        width: '40%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    element: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    elementIcon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginBottom: 5,
    },
});

import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonText from '@components/commons/CommonText';
import QRCode from 'react-native-qrcode-svg';
import Tooltip from 'react-native-walkthrough-tooltip';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';

export default function WalletReceiveScreen({navigation, route}) {
    const {usdtWallet} = useSelector(state => state.WalletReducer);
    const {theme} = useSelector(state => state.ThemeReducer);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const copyToClipboard = async data => {
        await Clipboard.setString(data);
    };
    const shareAddress = async () => {
        await Share.open({
            title: '',
            message: usdtWallet.walletAddress,
        });
    };
    useEffect(() => {}, []);

    return (
        <View style={[styles.container]}>
            <SafeAreaView>
                <View style={styles.upperHeaderPlaceholder}></View>
            </SafeAreaView>
            <SafeAreaView
                style={[styles.header, {backgroundColor: theme.background}]}>
                <View style={styles.upperHeader}>
                    <CommonTouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon type={Icons.Feather} name={'arrow-left'} />
                    </CommonTouchableOpacity>
                    <CommonText>{usdtWallet.symbol.toUpperCase()}</CommonText>
                    <Icon
                        type={Icons.Ionicons}
                        name={'stats-chart'}
                        size={19}
                    />
                </View>
            </SafeAreaView>
            <View style={styles.contentContainer}>
                <View style={styles.qrCode}>
                    <View style={styles.qrCodeHeader}>
                        <CommonText style={[styles.text, styles.title]}>
                            {usdtWallet.name} {t('wallet.receive.wallet')}
                        </CommonText>
                    </View>

                    <QRCode
                        value={usdtWallet.walletAddress}
                        size={240}
                        backgroundColor={'white'}
                    />
                    <View style={styles.qrCodeFooter}>
                        <CommonText style={styles.text}>
                            {usdtWallet.walletAddress}
                        </CommonText>
                    </View>
                </View>
                <View style={styles.description}>
                    <CommonText style={styles.text}>
                        {t('wallet.receive.sendOnly')} {usdtWallet.symbol}{' '}
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
                            await copyToClipboard(usdtWallet.walletAddress);
                            setTooltipVisible(true);
                            setTimeout(() => {
                                setTooltipVisible(false);
                            }, 1000);
                        }}>
                        <View style={[styles.elementIcon]}>
                            <Tooltip
                                isVisible={tooltipVisible}
                                content={
                                    <CommonText>
                                        {t('wallet.receive.addressCopied')}
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
                        <CommonText>{t('wallet.receive.copy')}</CommonText>
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
                        <CommonText>{t('wallet.receive.share')}</CommonText>
                    </CommonTouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(220,246,246,1)',
    },
    upperHeaderPlaceholder: {
        height: 48,
    },
    header: {
        width: '100%',
        position: 'absolute',
    },
    upperHeader: {
        height: 48,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scrollViewContent: {},
    contentContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrCode: {
        minHeight: 280,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 3,
    },
    qrCodeHeader: {
        height: 50,
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

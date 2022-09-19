import React, {useEffect, useRef, useState} from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import {useTranslation} from 'react-i18next';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {formatNoComma, formatPrice} from '@src/utils/CurrencyUtil';
import {WalletFactory} from '@coingrig/core';
import Clipboard from '@react-native-clipboard/clipboard';
import CommonLoading from '@components/commons/CommonLoading';
import {showMessage} from 'react-native-flash-message';
import {applicationProperties} from '@src/application.properties';
import {Logs} from '@modules/log/logs';
import CommonButton from '@components/commons/CommonButton';
import ActionSheet from 'react-native-actions-sheet/src';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

export default function WalletSendScreen({navigation, route}) {
    const {coin} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const [destination, setDestination] = useState('');
    const [commissionFee, setCommissionFee] = useState(0);
    const [commissionFeeFiat, setCommissionFeeFiat] = useState(0);
    const [value, setValue] = useState('');
    const [wallet, setWallet] = useState();
    const [fees, setFees] = useState();
    const [feeFiat, setFeeFiat] = useState(0);
    const [toFiat, setToFiat] = useState(0);
    const actionSheetRef = useRef(null);
    const actionCamera = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            await setupWallet();
        })();
    }, []);
    const setAmount = v => {
        setValue(v);
        const formattedValue = formatNoComma(v);
        const fiatValue = !formattedValue ? 0 : coin.price * formattedValue;
        setToFiat(fiatValue);
    };
    const setupWallet = async () => {
        const _wallet = await WalletFactory.getWallet(coin);
        setWallet(_wallet);
    };
    const fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        setDestination(text);
    };

    const onSuccess = e => {
        setDestination(e.data);
        actionCamera.current?.setModalVisible(false);
    };
    const prepareTx = async () => {
        if (!value || !destination) {
            Alert.alert('Error', t('swap.input_required'));
            return;
        }
        const amountToSend = formatNoComma(value.toString());
        CommonLoading.show();
        try {
            const _fees = await wallet.getTxSendProposals(
                destination,
                amountToSend,
            );
            if (!_fees || Object.keys(_fees).length === 0) {
                showMessage({
                    message: t('message.error.amount_to_send_too_large'),
                    type: 'danger',
                });
                CommonLoading.hide();
                return;
            }
            let fFiat = _fees.regular.getFeeValue() * coin.price;
            setFeeFiat(fFiat);
            setFees(_fees);
            setCommissionFeeFiat(commissionFee * coin.price);
            CommonLoading.hide();
            actionSheetRef.current?.setModalVisible();
        } catch (error) {
            console.log(error);
            CommonLoading.hide();
            showMessage({
                message: t('message.error.remote_servers_not_available'),
                type: 'warning',
            });
        }
    };
    const executeTX = async () => {
        actionSheetRef.current?.setModalVisible(false);
        try {
            CommonLoading.show();
            const feeAmount = formatNoComma(commissionFee.toString());
            const _fees1 = await wallet.getTxSendProposals(
                applicationProperties.feeRecipient,
                feeAmount,
            );
            let txCommission = await wallet.postTxSend(_fees1.regular);
            const nonce = await wallet
                .getWeb3Client()
                .eth.getTransactionCount(coin.walletAddress);
            const newTx = {...fees.regular};
            newTx.settings.proposal.nonce = nonce + 1;
            console.log(fees.regular);
            let tx = await wallet.postTxSend(newTx);
            if (tx) {
                CommonLoading.hide();
                showMessage({
                    message: t('message.transaction_done'),
                    type: 'success',
                    duration: 5000,
                    onPress: () => {},
                });
                navigation.goBack();
            } else {
                CommonLoading.hide();
                showMessage({
                    message: t('message.error.transaction_can_not_be_executed'),
                    type: 'danger',
                });
            }
        } catch (error) {
            Logs.error(error);
            CommonLoading.hide();
            showMessage({
                message: t('message.error.transaction_can_not_be_executed'),
                type: 'danger',
            });
        }
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
                    <CommonText>
                        {t('tx.available')}: {coin?.balance ?? 0}{' '}
                        {coin?.symbol ?? ''}
                    </CommonText>
                    <View style={styles.headerPriceContainer}></View>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.gradientSecondary},
                            ]}>
                            <TextInput
                                style={styles.input}
                                onChangeText={v => setDestination(v)}
                                value={destination}
                                placeholder={t('tx.destination_address')}
                                numberOfLines={1}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                            />
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    await fetchCopiedText();
                                }}
                                style={styles.moreBtn}>
                                <Icon
                                    name="content-paste"
                                    size={20}
                                    type={Icons.MaterialIcons}
                                />
                            </CommonTouchableOpacity>
                            <CommonTouchableOpacity
                                onPress={() =>
                                    actionCamera.current?.setModalVisible()
                                }
                                style={styles.moreBtn2}>
                                <Icon
                                    name="qr-code"
                                    size={21}
                                    type={Icons.MaterialIcons}
                                />
                            </CommonTouchableOpacity>
                        </View>

                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.gradientSecondary},
                            ]}>
                            <TextInput
                                style={styles.input}
                                value={value}
                                placeholder={coin.symbol + ' ' + t('tx.amount')}
                                onChangeText={async v => {
                                    const commission = (v * 3) / 100;
                                    setCommissionFee(commission);
                                    setAmount(v);
                                }}
                                keyboardType="numeric"
                                numberOfLines={1}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                            />
                            <CommonTouchableOpacity
                                style={styles.moreBtn2}
                                onPress={async () => {
                                    const _fees =
                                        await wallet.getTxSendProposals(
                                            destination,
                                            coin.balance,
                                        );
                                    const commission = (coin.balance * 3) / 100;
                                    const gasFee =
                                        _fees.regular.getFeeValue() * 2;
                                    setCommissionFee(commission);
                                    const maxAmount =
                                        coin.balance - commission - gasFee;
                                    setAmount(maxAmount.toString());
                                }}>
                                <CommonText>{t('tx.max')}</CommonText>
                            </CommonTouchableOpacity>
                        </View>
                        <View style={styles.fiatContainer}>
                            <CommonText style={styles.toFiat}>
                                {'\u2248' + formatPrice(toFiat, false) || '$0'}
                            </CommonText>
                        </View>
                        <View style={styles.buttonContainer}>
                            <CommonButton
                                text={t('onboarding.next')}
                                onPress={async () => {
                                    await prepareTx();
                                }}
                            />
                        </View>
                    </View>
                    <ActionSheet
                        ref={actionSheetRef}
                        gestureEnabled={true}
                        headerAlwaysVisible
                        containerStyle={{
                            flex: 1,
                            backgroundColor: theme.gradientPrimary,
                        }}>
                        <LinearGradient
                            colors={[
                                theme.gradientPrimary,
                                theme.gradientSecondary,
                            ]}>
                            <CommonText style={styles.confirmtx}>
                                {t('tx.confirm_tx')}
                            </CommonText>
                            <View style={styles.amountusd}>
                                <CommonText style={{marginBottom: 5}}>
                                    {t('tx.amount_in_usd')}:{' '}
                                    {formatPrice(toFiat, true) || '$0'}
                                </CommonText>
                                <CommonText style={{marginBottom: 5}}>
                                    {t('tx.network_fee')}:{' '}
                                    {formatPrice(feeFiat, true)}
                                </CommonText>
                                <CommonText>
                                    {t('tx.commission')}:{' '}
                                    {formatPrice(commissionFeeFiat, true)}
                                </CommonText>
                                <CommonText style={styles.totalusd}>
                                    {t('tx.total_usd')}:{' '}
                                    {formatPrice(
                                        toFiat + feeFiat + commissionFeeFiat,
                                    )}
                                </CommonText>
                            </View>
                            <View style={styles.buttonContainer}>
                                <CommonButton
                                    text={t('onboarding.next')}
                                    onPress={async () => {
                                        await executeTX();
                                    }}
                                />
                            </View>
                        </LinearGradient>
                    </ActionSheet>
                    <ActionSheet
                        ref={actionCamera}
                        gestureEnabled={true}
                        headerAlwaysVisible
                        containerStyle={styles.cameracontainer}
                        onRead={onSuccess}>
                        <QRCodeScanner
                            onRead={() => {}}
                            cameraContainerStyle={{margin: 20}}
                            flashMode={RNCamera.Constants.FlashMode.auto}
                        />
                    </ActionSheet>
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
        height: Dimensions.get('window').height - 158,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },

    headerPriceContainer: {
        width: 70,
    },
    headerPriceText: {textAlign: 'right', marginRight: 10},
    inputView: {
        height: 70,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 14,
        marginVertical: 10,
        marginBottom: 0,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {flex: 1, color: 'white'},
    moreBtn: {
        justifyContent: 'center',
        marginRight: 20,
        paddingLeft: 10,
    },
    moreBtn2: {
        justifyContent: 'center',
        marginRight: 10,
    },
    toFiat: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 28,
        fontWeight: 'bold',
    },
    fiatContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    buttonContainer: {
        height: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
        marginTop: 10,
    },
    cameracontainer: {
        margin: 10,
        backgroundColor: 'black',
        height: 500,
    },
    confirmtx: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 15,
        fontWeight: 'bold',
    },
    exectx: {
        marginTop: 30,
        marginBottom: 30,
    },
    totalusd: {
        fontWeight: 'bold',
        marginTop: 20,
        fontSize: 16,
    },
    amountusd: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
});

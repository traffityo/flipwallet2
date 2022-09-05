import React, {createRef, useEffect, useState} from 'react';
import {
    Alert,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonText from '@components/commons/CommonText';
import {formatNoComma, formatPrice} from '@src/utils/CurrencyUtil';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import ActionSheet from 'react-native-actions-sheet/src';
import {WalletFactory} from '@coingrig/core';
import {showMessage} from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';
import {Logs} from '@modules/log/logs';
import CommonLoading from '@components/commons/CommonLoading';
import {applicationProperties} from '@src/application.properties';

const actionSheetRef: React.RefObject<any> = createRef();
const actionCamera: React.RefObject<any> = createRef();

export default function WalletSendScreen({navigation, route}) {
    const {item} = route.params;
    const {theme} = useSelector(state => state.ThemeReducer);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [destination, setDestination] = useState('');
    const [commissionFee, setCommissionFee] = useState(0);
    const [value, setValue] = useState('');
    const [wallet, setWallet] = useState();
    const [fees, setFees] = useState();
    const [feeFiat, setFeeFiat] = useState(0);
    const [toFiat, setToFiat] = useState(0);
    const [keyboardEnabled, setKeyboardEnabled] = useState(false);
    useEffect(async () => {
        await setupWallet();
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardEnabled(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardEnabled(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const setAmount = v => {
        setValue(v);
        const formattedValue = formatNoComma(v);
        const fiatValue = !formattedValue ? 0 : item.price * formattedValue;
        setToFiat(fiatValue);
    };
    const setupWallet = async () => {
        const _wallet = await WalletFactory.getWallet(item);
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
        Keyboard.dismiss();
        if (!value || !destination) {
            Alert.alert('Error', 'Please fill up the form');
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
                return;
            }
            let fFiat = _fees.regular.getFeeValue() * item.price;
            setFeeFiat(fFiat);
            setFees(_fees);
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
                .eth.getTransactionCount(item.walletAddress);
            const newTx = {...fees.regular};
            newTx.settings.proposal.nonce = nonce + 1;
            let tx = await wallet.postTxSend(fees.regular);
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
                    <CommonText>
                        {t('tx.available')}: {item?.balance ?? 0}{' '}
                        {item?.symbol ?? ''}
                    </CommonText>
                    <Icon
                        type={Icons.Ionicons}
                        name={'stats-chart'}
                        size={19}
                    />
                </View>
            </SafeAreaView>
            <View style={styles.scrollViewContent}>
                <View style={[styles.maincontainer, {flex: 1}]}>
                    <View style={styles.container}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 20,
                                marginHorizontal: 5,
                                marginTop: 10,
                                padding: 10,
                                elevation: 3,
                            }}>
                            <View style={styles.inputView}>
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

                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.input}
                                    value={value}
                                    placeholder={
                                        item.symbol + ' ' + t('tx.amount')
                                    }
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
                                                item.balance,
                                            );
                                        const commission =
                                            (item.balance * 3) / 100;
                                        const gasFee =
                                            _fees.regular.getFeeValue() * 2;
                                        setCommissionFee(commission);
                                        const maxAmount =
                                            item.balance - commission - gasFee;
                                        setAmount(maxAmount.toString());
                                    }}>
                                    <CommonText>{t('tx.max')}</CommonText>
                                </CommonTouchableOpacity>
                            </View>
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}>
                                <CommonText style={styles.toFiat}>
                                    {formatPrice(toFiat, true) || '$0'}
                                </CommonText>
                            </View>
                        </View>
                    </View>
                    <View style={styles.preparetx}>
                        <View
                            style={{
                                paddingVertical: 5,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                marginBottom: 5,
                            }}>
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    await prepareTx();
                                }}
                                style={[
                                    styles.button,
                                    {backgroundColor: '#26A17B'},
                                ]}>
                                <CommonText
                                    style={[
                                        styles.text,
                                        {color: theme.background},
                                    ]}>
                                    {t('onboarding.next')}
                                </CommonText>
                            </CommonTouchableOpacity>
                        </View>
                    </View>
                    <ActionSheet
                        ref={actionSheetRef}
                        gestureEnabled={true}
                        headerAlwaysVisible
                        containerStyle={{flex: 1}}>
                        <View style={{alignItems: 'center'}}>
                            <CommonText style={styles.confirmtx}>
                                {t('tx.confirm_tx')}
                            </CommonText>
                            <View style={styles.amountusd}>
                                <CommonText style={{marginBottom: 5}}>
                                    {t('tx.amount_in_usd')}:{' '}
                                    {formatPrice(toFiat, true) || '$0'}
                                </CommonText>
                                <CommonText>
                                    {t('tx.network_fee')}:{' '}
                                    {formatPrice(feeFiat, true)}
                                </CommonText>
                                <CommonText style={styles.totalusd}>
                                    {t('tx.total_usd')}:{' '}
                                    {formatPrice(toFiat + feeFiat)}
                                </CommonText>
                            </View>
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    await executeTX();
                                }}
                                style={[
                                    styles.button,
                                    {backgroundColor: '#26A17B'},
                                ]}>
                                <CommonText
                                    style={[
                                        styles.text,
                                        {color: theme.background},
                                    ]}>
                                    {t('onboarding.next')}
                                </CommonText>
                            </CommonTouchableOpacity>
                        </View>
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
    scrollViewContent: {
        flex: 1,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    round: {
        textAlign: 'center',
        marginTop: 5,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 45,
        marginBottom: 10,
        alignSelf: 'center',
        width: '75%',
    },
    roundBtn: {
        width: 50,
        height: 50,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    bigText: {
        fontSize: 50,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Bold',
        marginTop: '10%',
        marginHorizontal: '20%',
    },
    pills: {
        borderRadius: 5,
        padding: 5,
        margin: 10,
    },
    coins: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
    },
    maincontainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    toFiat: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Bold',
    },
    available: {
        fontSize: 12,
        fontWeight: 'normal',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        // marginRight: 15,
        marginTop: 3,
        textAlign: 'center',
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
        fontFamily: 'RobotoSlab-Bold',
        color: '#353333',
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
    preparetx: {flex: 1, justifyContent: 'flex-end', marginBottom: 40},
    input: {flex: 1},
    inputView: {
        height: 50,
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
    moreBtn: {
        justifyContent: 'center',
        marginRight: 20,
        paddingLeft: 10,
    },
    moreBtn2: {
        justifyContent: 'center',
        marginRight: 10,
    },
    value: {
        height: 40,
        marginVertical: 10,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 5,
        borderColor: '#756156',
        fontSize: 14,
        marginHorizontal: 20,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        height: 70,
        width: 350,
    },
});

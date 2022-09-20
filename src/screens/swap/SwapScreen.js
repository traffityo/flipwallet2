import React, {useEffect, useState} from 'react';
import {
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
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useTranslation} from 'react-i18next';
import CommonImage from '@components/commons/CommonImage';
import Icon, {Icons} from '@components/icons/Icons';
import {TokenService} from '@persistence/token/TokenService';
import {
    calcFee,
    formatCoins,
    formatNoComma,
    formatPrice,
    toEth,
    toWei,
} from '@src/utils/CurrencyUtil';
import CommonButton from '@components/commons/CommonButton';
import {showMessage} from 'react-native-flash-message';
import {WalletService} from '@persistence/wallet/WalletService';
import {applicationProperties} from '@src/application.properties';
import {Logs} from '@modules/log/logs';
import BigNumber from 'bignumber.js';
import CommonLoading from '@components/commons/CommonLoading';
import _ from 'lodash';
import {Segment, SegmentedControl} from 'react-native-resegmented-control';
import {WalletAction} from '@persistence/wallet/WalletAction';

export default function SwapScreen({navigation, route}) {
    const coin = route.params?.coin;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const [fromToken, setFromToken] = useState({});
    const [toToken, setToToken] = useState({});
    const [fromTokenAmount, setFromTokenAmount] = useState('');
    const [toTokenAmount, setToTokenAmount] = useState('');
    const [platform, setPlatform] = useState(coin ? coin.chain : 'ETH');
    const [quote, setQuote] = useState(null);
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            dispatch(WalletAction.getActiveWalletByChain(platform)).then(
                ({data}) => {
                    const nativeToken = {
                        address: coin ? coin.walletAddress : data.walletAddress,
                        balance: coin ? coin.balance : data.balance,
                        decimals: coin ? coin.decimals : data.decimals,
                        id: coin ? coin.symbol : data.symbol,
                        name: coin ? coin.name : data.name,
                        rate: coin ? coin.price : data.price,
                        symbol: coin ? coin.symbol : data.symbol,
                        thumb: coin ? coin.image : data.image,
                        isNative: coin ? coin.isNative : true,
                    };
                    setFromToken(nativeToken);
                },
            );
        })();
    }, []);
    const reset = () => {
        setFromTokenAmount('');
        setQuote(null);
        setToTokenAmount('');
    };
    const onChangePlatform = platform => {
        getActiveWalletByChain(platform);
        reset();
        setToToken({});
    };
    const getActiveWalletByChain = chain => {
        dispatch(WalletAction.getActiveWalletByChain(chain)).then(
            ({success, data}) => {
                const nativeToken = {
                    address: data.walletAddress,
                    balance: data.balance,
                    decimals: data.decimals,
                    id: data.symbol,
                    name: data.name,
                    rate: data.price,
                    symbol: data.symbol,
                    thumb: data.image,
                    isNative: true,
                };
                setFromToken(nativeToken);
            },
        );
    };
    const swapPosition = () => {
        const tempToken = fromToken;
        if (toTokenAmount > toToken.balance) {
            setFromTokenAmount(formatCoins(toToken.balance).toString());
        } else {
            setFromTokenAmount(toTokenAmount);
        }
        setFromToken(toToken);
        setToToken(tempToken);
        setToTokenAmount('');
        setQuote(null);
    };
    const getQuote = async () => {
        const tokenAmount = Number(fromTokenAmount);
        if (
            isNaN(tokenAmount) ||
            tokenAmount <= 0 ||
            _.isEmpty(fromToken) ||
            _.isEmpty(toToken)
        ) {
            showMessage({
                message: t('swap.input_required'),
                type: 'warning',
            });
            return;
        }
        let sellAmount = toWei(
            formatNoComma(fromTokenAmount),
            fromToken?.decimals,
        ).toLocaleString('fullwide', {useGrouping: false});

        const buyAddress = toToken.isNative ? toToken.symbol : toToken.address;
        const sellAddress = fromToken.isNative
            ? fromToken.symbol
            : fromToken.address;
        await fetchQuote(buyAddress, sellAddress, sellAmount, false);
    };
    const fetchQuote = async (
        buyToken,
        sellToken,
        sellAmount,
        exact = false,
    ) => {
        CommonLoading.show();
        let params: any = {
            buyToken: buyToken,
            sellToken: sellToken,
            sellAmount: sellAmount,
            slippagePercentage: 0.005,
        };
        if (exact === true) {
            params.takerAddress = activeWallet.walletAddress;
            params.buyTokenPercentageFee = applicationProperties.swapFee;
            params.feeRecipient = applicationProperties.feeRecipient;
        }
        try {
            const resQuote = await OxService.getQuote(platform, params);
            if (!resQuote) {
                showMessage({
                    message: t('swap.error.swap_not_found'),
                    type: 'warning',
                });
                CommonLoading.hide();
                return;
            }
            if (resQuote.code === 100) {
                showMessage({
                    message: t('swap.insufficient_asset_liquidity'),
                    type: 'warning',
                });
                CommonLoading.hide();
                return;
            }
            if (
                Number(fromToken?.balance) <
                Number(toEth(resQuote.sellAmount, fromToken?.decimals))
            ) {
                showMessage({
                    message: t('swap.error.not_enough_balance'),
                    type: 'warning',
                });
                CommonLoading.hide();
                return;
            }
            setQuote(resQuote);
            setToTokenAmount(
                toEth(resQuote.buyAmount, toToken?.decimals).toString(),
            );
            setFromTokenAmount(
                toEth(resQuote.sellAmount, fromToken?.decimals).toString(),
            );
            return resQuote;
        } catch (e) {
            Logs.info(e);
            return null;
        } finally {
            CommonLoading.hide();
        }
    };
    const swap = async () => {
        CommonLoading.show();
        let sellAmount = toWei(
            formatNoComma(fromTokenAmount),
            fromToken?.decimals,
        ).toLocaleString('fullwide', {useGrouping: false});
        const buyAddress = toToken.isNative ? toToken.symbol : toToken.address;
        const sellAddress = fromToken.isNative
            ? fromToken.symbol
            : fromToken.address;
        const walletByChain = await WalletService.getWalletByChainId(
            fromToken.chainId,
        );
        if (walletByChain.success) {
            try {
                let signingManager = cryptoWallet.getSigningManager();
                let w3client = signingManager?.client;
                if (!fromToken.isNative) {
                    const tokenContract = new w3client.eth.Contract(
                        ERC20_ABI,
                        fromToken.address,
                    );
                    const currentAllowance = await tokenContract.methods
                        .allowance(activeWallet.walletAddress, ZERO_EX_ADDRESS)
                        .call();
                    if (
                        new BigNumber(currentAllowance).isLessThan(
                            new BigNumber(quote.sellAmount),
                        )
                    ) {
                        const approvalData =
                            await tokenContract.methods.approve(
                                ZERO_EX_ADDRESS,
                                sellAmount,
                            );
                        const gasEstimate = await approvalData.estimateGas();
                        const tx = await approvalData.send({
                            from: activeWallet.walletAddress,
                            gas: gasEstimate,
                            gasPrice: quote.gasPrice,
                        });
                        Logs.info('Approval transaction: ' + tx);
                    }
                }
                const exactQuote = await fetchQuote(
                    buyAddress,
                    sellAddress,
                    sellAmount,
                    true,
                );
                if (!exactQuote) {
                    return;
                }
                const transactionConfig = {
                    from: exactQuote.from,
                    to: exactQuote.to,
                    data: exactQuote.data,
                    value: exactQuote.value,
                    gasPrice: exactQuote.gasPrice,
                    gas: exactQuote.gas,
                };
                w3client.eth.sendTransaction(
                    transactionConfig,
                    function (error, hash) {
                        console.log(hash);
                        console.log(error);
                        reset();
                        CommonLoading.hide();
                        showMessage({
                            message: t('swap.message.swap_executed'),
                            type: 'success',
                        });
                    },
                );
            } catch (e) {
                console.log(e);
                CommonLoading.hide();
            }
        }
    };
    const calculateFee = (gas, gasPrice) => {
        const fee = calcFee(gas, gasPrice);
        const finalFee = toEth(fee, activeWallet.decimals);
        const dollarFee = calcFee(finalFee, activeWallet.price);
        return formatPrice(dollarFee);
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
                    <CommonText>{t('swap.title')}</CommonText>
                    <View style={styles.headerPriceContainer}></View>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.segmentContainer}>
                            <SegmentedControl
                                activeTintColor={theme.text}
                                inactiveTintColor={theme.text2}
                                initialSelectedName={platform}
                                style={[
                                    styles.segment,
                                    {backgroundColor: theme.gradientSecondary},
                                ]}
                                sliderStyle={{
                                    backgroundColor: theme.button,
                                }}
                                onChangeValue={name => {
                                    onChangePlatform(name);
                                    setPlatform(name);
                                }}>
                                <Segment name="ETH" content={'Ethereum'} />
                                <Segment name="BSC" content={'BSC'} />
                                <Segment name="POLYGON" content={'Polygon'} />
                            </SegmentedControl>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.gradientSecondary},
                            ]}>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={v => setFromTokenAmount(v)}
                                    value={fromTokenAmount}
                                    placeholder={t('swap.you_pay')}
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    placeholderTextColor="gray"
                                    autoCompleteType={'off'}
                                    autoCapitalize={'none'}
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                />
                            </View>
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    navigation.navigate('SelectTokenScreen', {
                                        platform: platform,
                                        onSelect: async item => {
                                            await TokenService.getTokenBalance(
                                                item,
                                            );
                                            setFromToken(item);
                                        },
                                    });
                                }}
                                style={styles.tokenContainer}>
                                {_.isEmpty(fromToken) && (
                                    <>
                                        <View style={styles.tokenImg}>
                                            <Icon
                                                name="plus"
                                                size={21}
                                                type={Icons.Feather}
                                            />
                                        </View>
                                        <CommonText>Select</CommonText>
                                    </>
                                )}
                                {!_.isEmpty(fromToken) && (
                                    <>
                                        <CommonImage
                                            source={{uri: fromToken.thumb}}
                                            style={styles.tokenImg}
                                        />
                                        <CommonText>
                                            {formatCoins(fromToken.balance)}
                                        </CommonText>
                                        <CommonText style={{fontSize: 9}}>
                                            {fromToken.symbol}
                                        </CommonText>
                                    </>
                                )}
                            </CommonTouchableOpacity>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.gradientSecondary},
                            ]}>
                            <TextInput
                                style={styles.input}
                                onChangeText={v => setToTokenAmount(v)}
                                value={toTokenAmount}
                                placeholder={t('swap.you_get')}
                                numberOfLines={1}
                                returnKeyType="done"
                                keyboardType={'numeric'}
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                            />
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    navigation.navigate('SelectTokenScreen', {
                                        platform: platform,
                                        onSelect: async item => {
                                            await TokenService.getTokenBalance(
                                                item,
                                            );
                                            setToToken(item);
                                        },
                                    });
                                }}
                                style={styles.tokenContainer}>
                                {_.isEmpty(toToken) && (
                                    <>
                                        <View style={styles.tokenImg}>
                                            <Icon
                                                name="plus"
                                                size={21}
                                                type={Icons.Feather}
                                            />
                                        </View>
                                        <CommonText>Select</CommonText>
                                    </>
                                )}
                                {!_.isEmpty(toToken) && (
                                    <>
                                        <CommonImage
                                            source={{uri: toToken.thumb}}
                                            style={styles.tokenImg}
                                        />
                                        <CommonText>
                                            {formatCoins(toToken.balance)}
                                        </CommonText>
                                        <CommonText style={{fontSize: 9}}>
                                            {toToken.symbol}
                                        </CommonText>
                                    </>
                                )}
                            </CommonTouchableOpacity>
                        </View>
                        <CommonTouchableOpacity
                            style={[
                                styles.exchangeContainer,
                                {
                                    backgroundColor: theme.gradientSecondary,
                                    borderColor: theme.gradientPrimary,
                                    borderWidth: 0.5,
                                },
                            ]}
                            onPress={() => {
                                swapPosition();
                            }}>
                            <Icon
                                name="swap-vertical"
                                size={21}
                                type={Icons.MaterialCommunityIcons}
                            />
                        </CommonTouchableOpacity>
                        <View style={styles.quoteContainer}>
                            <CommonText>
                                {t('coindetails.price')} 1 {fromToken.symbol}
                            </CommonText>
                            <CommonText>
                                {quote
                                    ? formatPrice(quote.price) +
                                      ' ' +
                                      toToken.symbol
                                    : '-'}
                            </CommonText>
                        </View>
                        <View style={styles.quoteContainer}>
                            <CommonText>{t('swap.slippage')}</CommonText>
                            <CommonText>0.5%</CommonText>
                        </View>
                        <View style={styles.quoteContainer}>
                            <CommonText>{t('swap.estimated_gas')}</CommonText>
                            <CommonText>
                                {quote != null
                                    ? calculateFee(quote.gas, quote.gasPrice)
                                    : '-'}
                            </CommonText>
                        </View>
                        <View style={styles.quoteContainer}>
                            <CommonText>Commission fee</CommonText>
                            <CommonText>
                                {' '}
                                {applicationProperties.swapFee * 100 + '%'}
                            </CommonText>
                        </View>
                        <View style={styles.quoteContainer}>
                            <CommonText>{t('swap.allowance')}</CommonText>
                            <CommonText>{t('swap.exact_amount')}</CommonText>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CommonButton
                            text={!quote ? 'Get Quote' : 'Swap'}
                            onPress={async () => {
                                if (quote) {
                                    await swap();
                                } else {
                                    await getQuote();
                                }
                            }}
                        />
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
        paddingHorizontal: 10,
        alignItems: 'center',
        marginTop: 20,
        flex: 1,
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
    headerPriceContainer: {
        width: 70,
    },
    inputView: {
        height: 70,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 14,
        marginVertical: 10,
        marginBottom: 0,
        marginHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {flex: 1, color: 'white'},
    tokenContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tokenImg: {
        width: 24,
        height: 24,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exchangeContainer: {
        height: 32,
        width: 32,
        borderRadius: 5,
        position: 'absolute',
        top: 115,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    tokenSymbols: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 10,
    },
    tokenBalance: {width: '100%', height: 25},
    buttonContainer: {
        paddingHorizontal: 10,
        flex: 1,
    },
    quoteContainer: {
        height: 50,
        width: '100%',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    segmentContainer: {
        paddingHorizontal: 5,
        height: 45,
    },
    segment: {
        height: 35,
        width: '100%',
    },
});

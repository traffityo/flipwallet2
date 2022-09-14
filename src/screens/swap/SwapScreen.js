import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useTranslation} from 'react-i18next';
import CommonImage from '@components/commons/CommonImage';
import Icon, {Icons} from '@components/icons/Icons';
import {TokenService} from '@persistence/token/TokenService';
import {
    formatCoins,
    formatNoComma,
    toEth,
    toWei,
} from '@src/utils/CurrencyUtil';
import {OxService} from '@persistence/0x/0xService';
import CommonButton from '@components/commons/CommonButton';
import {showMessage} from 'react-native-flash-message';
import {Logs} from '@modules/log/logs';
import {WalletService} from '@persistence/wallet/WalletService';
import {WalletFactory} from '@coingrig/core';
import BigNumber from 'bignumber.js';
import {ERC20_ABI} from '@persistence/wallet/WalletConstant';

export default function SwapScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const [fromToken, setFromToken] = useState(null);
    const [toToken, setToToken] = useState(null);
    const [fromTokenAmount, setFromTokenAmount] = useState('');
    const [toTokenAmount, setToTokenAmount] = useState('');
    const [platform, setPlatform] = useState('ETH');
    const [quote, setQuote] = useState({});
    useEffect(() => {
        (async () => {})();
    }, []);
    const swapPosition = () => {
        const tempToken = fromToken;
        const tempTokenAmount = fromTokenAmount;
        setFromToken(toToken);
        setFromTokenAmount(toTokenAmount);
        setToToken(tempToken);
        setToTokenAmount(tempTokenAmount);
    };
    const getQuote = async () => {
        let sellAmount = toWei(
            formatNoComma(fromTokenAmount),
            fromToken?.decimals,
        ).toLocaleString('fullwide', {useGrouping: false});
        const params = {
            buyToken: toToken.address,
            sellToken: fromToken.address,
            sellAmount: sellAmount,
            slippagePercentage: 0.05,
        };
        const resQuote = await OxService.getQuote(platform, params);
        if (!resQuote) {
            showMessage({
                message: t('swap.error.swap_not_found'),
                type: 'warning',
            });
            return;
        }
        setQuote(resQuote);
        setToTokenAmount(
            toEth(resQuote.buyAmount, toToken?.decimals).toString(),
        );
        setFromTokenAmount(
            toEth(resQuote.sellAmount, fromToken?.decimals).toString(),
        );
        if (Number(fromToken?.balance) < Number(resQuote.sellAmount)) {
            showMessage({
                message: t('swap.error.not_enough_balance'),
                type: 'warning',
            });
            return;
        }
        if (
            resQuote.allowanceTarget !==
            '0x0000000000000000000000000000000000000000'
        ) {
            // Trading an ERC20 token, an allowance must be first set!
            Logs.info('Checking allowance');
            // Check if the contract has sufficient allowance
            const walletByChain = await WalletService.getWalletByChainId(
                fromToken.chainId,
            );
            if (walletByChain.success) {
                const cryptoWallet = WalletFactory.getWallet({
                    ...fromToken,
                    privKey: walletByChain.data.privKey,
                    walletAddress: walletByChain.data.walletAddress,
                });
                let contract = new cryptoWallet.eth.Contract(
                    ERC20_ABI,
                    resQuote.sellTokenAddress,
                );
                resQuote.from = chainAddress;
                const spendingAllowance = await contract.methods
                    .allowance(resQuote.from, resQuote.allowanceTarget)
                    .call();
                // Are we already allowed to sell the amount we desire?
                if (
                    new BigNumber(spendingAllowance).isLessThan(
                        new BigNumber(resQuote.sellAmount),
                    )
                ) {
                    Logs.info(
                        'Approval required',
                        `${spendingAllowance} < ${resQuote.sellAmount}`,
                    );

                    return;
                } else {
                    Logs.info('Allowance is sufficient');
                }
            }
        } else {
            Logs.info('Allowance is not required');
        }
        console.log(quote);
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
                    <CommonText>Swap</CommonText>
                    <View style={styles.headerPriceContainer}></View>
                </View>
                <ScrollView>
                    <View style={styles.content}>
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
                                    placeholder={t('tx.destination_address')}
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
                                {fromToken == null && (
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
                                {fromToken !== null && (
                                    <>
                                        <CommonImage
                                            source={{uri: fromToken.thumb}}
                                            style={styles.tokenImg}
                                        />
                                        <CommonText>
                                            {fromToken.balance}
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
                                placeholder={t('tx.destination_address')}
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
                                {toToken == null && (
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
                                {toToken !== null && (
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
                    </View>
                    <View style={styles.buttonContainer}>
                        <CommonButton
                            text={'Get Quote'}
                            onPress={async () => {
                                await getQuote();
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
        marginHorizontal: 15,
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
        top: 70,
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
    },
});

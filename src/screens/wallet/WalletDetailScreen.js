import React, {useCallback, useEffect, useState} from 'react';
import {
    RefreshControl,
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
import {formatCoins, formatPrice} from '@src/utils/CurrencyUtil';
import BigList from 'react-native-big-list';
import CommonImage from '@components/commons/CommonImage';
import {WalletService} from '@persistence/wallet/WalletService';
import CommonLoading from '@components/commons/CommonLoading';
import {WalletAction} from '@persistence/wallet/WalletAction';

export default function WalletDetailScreen({navigation, route}) {
    const {coin} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const [transactions, setTransactions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        CommonLoading.show();
        dispatch(WalletAction.getAccountBalance()).then(() => {
            setRefreshing(false);
            CommonLoading.hide();
        });
    }, []);
    useEffect(() => {
        (async () => {
            const {success, data} = await WalletService.getTransactionsByWallet(
                coin,
            );
            if (success) {
                setTransactions(data);
            }
        })();
    }, []);
    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity
                onPress={async () => {
                    navigation.navigate('WalletTransactionDetailScreen', {
                        tx: {...coin, ...item},
                    });
                }}
                style={styles.item}>
                <View style={styles.itemIcon}>
                    <CommonImage
                        source={
                            item.sender
                                ? require('@assets/send.png')
                                : require('@assets/receive.png')
                        }
                        style={{width: 32, height: 32}}
                    />
                </View>
                <View style={styles.itemDetail}>
                    <CommonText
                        ellipsizeMode="middle"
                        numberOfLines={1}
                        style={styles.itemToAddressText}>
                        {item.to}
                    </CommonText>
                    <CommonText style={styles.itemAmountSub}>
                        {item.date}
                    </CommonText>
                </View>
                <View style={styles.itemAmount}>
                    <CommonText
                        style={[
                            styles.itemAmountText,
                            {color: item.sender ? '#f33360' : '#24a86f'},
                        ]}>
                        {item.sender ? '-' : '+'}
                        {formatPrice(item.etherValue)}{' '}
                        {coin.symbol || coin.tokenSymbol}
                    </CommonText>
                </View>
            </CommonTouchableOpacity>
        );
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
                    <CommonText>{coin.name}</CommonText>
                    <View style={styles.headerPriceContainer}>
                        <CommonText
                            style={styles.headerPriceText}
                            numberOfLines={1}>
                            {formatPrice(coin.price)}
                        </CommonText>
                    </View>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <View style={styles.content}>
                        <View style={styles.priceContainer}>
                            <CommonText
                                adjustsFontSizeToFit
                                numberOfLines={1}
                                style={styles.priceValue}>
                                {formatPrice(coin.value) || 0}
                            </CommonText>
                            <CommonText style={styles.coinValue}>
                                {formatCoins(coin.balance) || 0} {coin.symbol}
                            </CommonText>
                            <CommonText style={styles.coinNetwork}>
                                {coin.chain + ' ' + t('wallet.network')}
                            </CommonText>
                        </View>
                        <View
                            style={[
                                styles.btnContainer,
                                {width: coin.cid != 'bitcoin' ? '70%' : '60%'},
                            ]}>
                            <View>
                                <CommonTouchableOpacity
                                    onPress={() => {
                                        navigation.navigate(
                                            'WalletSendScreen',
                                            {
                                                coin: coin,
                                            },
                                        );
                                    }}
                                    style={[
                                        styles.roundBtn,
                                        {
                                            backgroundColor:
                                                theme.gradientSecondary,
                                        },
                                    ]}>
                                    <Icon
                                        type={Icons.Entypo}
                                        name={'chevron-with-circle-up'}
                                        size={26}
                                        color={'white'}
                                    />
                                </CommonTouchableOpacity>
                                <CommonText style={styles.round}>
                                    {t('wallet.send')}
                                </CommonText>
                            </View>
                            <View>
                                <CommonTouchableOpacity
                                    onPress={() => {
                                        navigation.navigate(
                                            'WalletReceiveScreen',
                                            {
                                                coin: coin,
                                            },
                                        );
                                    }}
                                    style={[
                                        styles.roundBtn,
                                        {
                                            backgroundColor:
                                                theme.gradientSecondary,
                                        },
                                    ]}>
                                    <Icon
                                        type={Icons.Entypo}
                                        name={'chevron-with-circle-down'}
                                        size={26}
                                        color={'white'}
                                    />
                                </CommonTouchableOpacity>
                                <CommonText style={styles.round}>
                                    {t('wallet.receive')}
                                </CommonText>
                            </View>
                            {coin.cid != 'bitcoin' && (
                                <View>
                                    <CommonTouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('SwapScreen', {
                                                coin: coin,
                                            });
                                        }}
                                        style={[
                                            styles.roundBtn,
                                            {
                                                backgroundColor:
                                                    theme.gradientSecondary,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.AntDesign}
                                            name={'sync'}
                                            size={24}
                                            color={'white'}
                                        />
                                    </CommonTouchableOpacity>
                                    <CommonText style={styles.round}>
                                        {t('wallet.swap')}
                                    </CommonText>
                                </View>
                            )}
                            <View>
                                <CommonTouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('WalletBuyScreen', {
                                            coin: coin,
                                        });
                                    }}
                                    style={[
                                        styles.roundBtn,
                                        {
                                            backgroundColor:
                                                theme.gradientSecondary,
                                        },
                                    ]}>
                                    <Icon
                                        type={Icons.AntDesign}
                                        name={'creditcard'}
                                        size={24}
                                        color={'white'}
                                    />
                                </CommonTouchableOpacity>
                                <CommonText style={styles.round}>
                                    {t('wallet.buysell')}
                                </CommonText>
                            </View>
                        </View>
                        {transactions.length > 0 && (
                            <View style={styles.transactionContainer}>
                                <View style={styles.transactionHeader}>
                                    <CommonText style={styles.transactionTitle}>
                                        Transactions
                                    </CommonText>
                                    <Icon
                                        type={Icons.Feather}
                                        name={'chevrons-right'}
                                        size={24}
                                        color={'white'}
                                    />
                                </View>
                                <View style={styles.transactionBody}>
                                    <BigList
                                        data={transactions}
                                        renderItem={renderItem}
                                        itemHeight={70}
                                        insetBottom={30}
                                        insetTop={10}
                                        keyboardDismissMode="on-drag"
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </View>
                        )}
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
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    priceContainer: {
        width: '100%',
        height: 200,
    },
    priceValue: {
        fontSize: 50,
        textAlign: 'center',
        marginTop: '10%',
        marginHorizontal: '20%',
    },
    coinValue: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
    },
    coinNetwork: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
        width: '75%',
    },
    roundBtn: {
        width: 58,
        height: 58,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderWidth: 0.5,
    },
    round: {
        textAlign: 'center',
        marginTop: 5,
    },
    headerPriceContainer: {
        width: 70,
    },
    headerPriceText: {textAlign: 'right', marginRight: 10},
    transactionContainer: {
        marginTop: 20,
        width: '100%',
    },
    transactionHeader: {
        height: 38,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    transactionBody: {
        flex: 1,
        height: 355,
    },
    item: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        alignItems: 'center',
    },
    img: {
        width: 20,
        height: 20,
        marginRight: 0,
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        flex: 5,
        //color: Colors.foreground,
        marginLeft: 10,
        fontSize: 17,
    },
    itemSymbol: {
        flex: 1,
        //color: Colors.lighter,
        marginLeft: 10,
        fontSize: 13,
        textAlign: 'right',
    },
    itemIcon: {
        width: 30,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemAmount: {
        width: 120,
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    itemDetail: {
        flex: 1,
        paddingLeft: 10,
    },
    itemAmountText: {
        color: '#f33360',
        fontSize: 15,
        fontWeight: 'bold',
    },
    itemAmountSub: {
        color: '#8c8c8c',
        fontSize: 13,
        fontWeight: 'bold',
    },
    itemToAddressText: {
        color: '#343434',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

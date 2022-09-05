import React, {useCallback, useEffect, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {useTranslation} from 'react-i18next';
import CommonText from '@components/commons/CommonText';
import HeaderBackground from '@components/HeaderBackground';
import Balance from '@components/Balance';
import CommonImage from '@components/commons/CommonImage';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {formatCoins, formatPrice} from '@src/utils/CurrencyUtil';

export default function HomeScreen({navigation, route}) {
    const {t} = useTranslation();
    const {bnbWallet, usdtWallet} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        (async () => {})();
    }, []);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        dispatch(WalletAction.getAccountBalance()).then(() => {
            setRefreshing(false);
        });
    }, []);
    return (
        <View style={[styles.container]}>
            <HeaderBackground />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{minHeight: 790}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <SafeAreaView style={styles.header}>
                    <View style={styles.balanceContainer}>
                        <View style={styles.balance}>
                            <CommonText style={styles.balanceText}>
                                Your Balance:
                            </CommonText>
                            <Balance />
                        </View>
                        <View style={styles.logo}>
                            <CommonImage
                                source={{
                                    uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                                }}
                                style={{width: 38, height: 38}}
                            />
                        </View>
                    </View>
                </SafeAreaView>

                <SafeAreaView style={styles.content}>
                    <View style={styles.featureContainer}>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletSendScreen', {
                                    item: usdtWallet,
                                });
                            }}
                            style={styles.featureItemContainer}>
                            <View style={styles.featureItem}>
                                <Icon
                                    type={Icons.Entypo}
                                    name={'chevron-with-circle-up'}
                                    size={24}
                                    color={'#26A17B'}
                                />
                            </View>
                            <CommonText style={styles.featureItemText}>
                                Send
                            </CommonText>
                        </CommonTouchableOpacity>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletReceiveScreen', {
                                    item: usdtWallet,
                                });
                            }}
                            style={styles.featureItemContainer}>
                            <View style={styles.featureItem}>
                                <Icon
                                    type={Icons.Entypo}
                                    name={'chevron-with-circle-down'}
                                    size={24}
                                    color={'#26A17B'}
                                />
                            </View>
                            <CommonText style={styles.featureItemText}>
                                Receive
                            </CommonText>
                        </CommonTouchableOpacity>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletBuyScreen', {
                                    item: usdtWallet,
                                });
                            }}
                            style={styles.featureItemContainer}>
                            <View style={styles.featureItem}>
                                <Icon
                                    type={Icons.Entypo}
                                    name={'credit-card'}
                                    size={24}
                                    color={'#26A17B'}
                                />
                            </View>
                            <CommonText style={styles.featureItemText}>
                                Buy
                            </CommonText>
                        </CommonTouchableOpacity>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletTransactionScreen', {
                                    item: usdtWallet,
                                });
                            }}
                            style={styles.featureItemContainer}>
                            <View style={styles.featureItem}>
                                <Icon
                                    type={Icons.FontAwesome}
                                    name={'history'}
                                    size={24}
                                    color={'#26A17B'}
                                />
                            </View>
                            <CommonText style={styles.featureItemText}>
                                History
                            </CommonText>
                        </CommonTouchableOpacity>
                    </View>
                    <View style={styles.transactionContainer}>
                        <View style={styles.transactionTitle}>
                            <CommonText style={styles.transactionTitleText}>
                                Assets
                            </CommonText>
                        </View>
                        <CommonTouchableOpacity
                            style={styles.transactionItem}
                            onPress={() => {
                                navigation.navigate('WalletDetailScreen', {
                                    item: bnbWallet,
                                });
                            }}>
                            <View style={styles.itemIcon}>
                                <CommonImage
                                    source={{uri: bnbWallet.image}}
                                    style={{width: 32, height: 32}}
                                />
                            </View>
                            <View style={styles.itemDetail}>
                                <CommonText
                                    ellipsizeMode="middle"
                                    numberOfLines={1}
                                    style={styles.itemToAddressText}>
                                    {bnbWallet.name}
                                </CommonText>
                                <CommonText style={styles.itemAmountSub}>
                                    {bnbWallet.symbol}
                                </CommonText>
                            </View>
                            <View style={styles.itemAmount}>
                                <CommonText style={styles.itemAmountText}>
                                    {formatCoins(bnbWallet.balance)}{' '}
                                    {bnbWallet.symbol}
                                </CommonText>
                                <CommonText style={styles.itemAmountSub}>
                                    {formatPrice(bnbWallet.value)}
                                    {' USD'}
                                </CommonText>
                            </View>
                        </CommonTouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 160,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'rgba(220,246,246,1)',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12.35,

        elevation: 19,
    },
    balanceContainer: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    balance: {
        flex: 1,
    },
    logo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    balanceText: {
        color: 'white',
    },
    featureContainer: {
        backgroundColor: '#26A17B',
        height: 100,
        width: '100%',
        borderRadius: 20,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12.35,

        elevation: 19,
    },
    featureItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureItem: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureItemText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 3,
    },
    transactionContainer: {
        flex: 1,
        alignItems: 'center',
    },
    transactionTitle: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionTitleText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    transactionTitleText2: {
        color: '#569df8',
        fontSize: 13,
    },
    transactionItem: {
        width: '100%',
        height: 70,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#8f8f8f',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,

        elevation: 5,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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

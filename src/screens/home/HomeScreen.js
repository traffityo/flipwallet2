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
import Icon, {Icons} from '@components/icons/Icons';
import {MarketAction} from '@persistence/market/MarketAction';
import {useTranslation} from 'react-i18next';
import NoticeSlider from '@components/NoticeSlider';
import CommonText from '@components/commons/CommonText';
import PriceChart from '@components/PriceChart';
import Balance from '@components/Balance';

export default function HomeScreen({navigation, route}) {
    const {wallets, totalBalance} = useSelector(state => state.WalletReducer);
    const {theme} = useSelector(state => state.ThemeReducer);
    const {topCoins} = useSelector(state => state.MarketReducer);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        (async () => {
            dispatch(WalletAction.getAccountBalance());
            dispatch(MarketAction.getTopCoins(5));
        })();
    }, []);
    const onRefresh = useCallback(async () => {
        dispatch(WalletAction.getAccountBalance()).then(() => {
            setRefreshing(false);
        });
        dispatch(MarketAction.getTopCoins(5));
    }, []);
    return (
        <View style={[styles.container]}>
            <SafeAreaView>
                <View style={styles.upperHeaderPlaceholder}></View>
            </SafeAreaView>
            <SafeAreaView
                style={[styles.header, {backgroundColor: theme.background}]}>
                <View style={styles.upperHeader}>
                    <Balance />
                    <Icon type={Icons.Feather} name={'bell'} />
                </View>
            </SafeAreaView>
            <ScrollView
                transperant
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <View style={styles.scrollViewContent}>
                    <View style={styles.noticeContainer}>
                        <NoticeSlider />
                    </View>
                    <View style={{marginVertical: 20}}>
                        <View style={[styles.featureIconContainer]}>
                            <View style={styles.featureRow}>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'arrow-alt-circle-down'}
                                        />
                                    </View>
                                    <CommonText>Deposit</CommonText>
                                </View>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'user-plus'}
                                        />
                                    </View>
                                    <CommonText>Referral</CommonText>
                                </View>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'gift'}
                                        />
                                    </View>
                                    <CommonText>Earn</CommonText>
                                </View>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'coins'}
                                        />
                                    </View>
                                    <CommonText>Save</CommonText>
                                </View>
                            </View>
                            <View style={styles.featureRow}>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem2,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'book'}
                                        />
                                    </View>
                                    <CommonText>Order</CommonText>
                                </View>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem2,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'gifts'}
                                        />
                                    </View>
                                    <CommonText>Giftcard</CommonText>
                                </View>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem2,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'money-bill'}
                                        />
                                    </View>
                                    <CommonText>Deposit</CommonText>
                                </View>
                                <View style={styles.featureItemContainer}>
                                    <View
                                        style={[
                                            styles.featureItem,
                                            {
                                                backgroundColor:
                                                    theme.featureItem2,
                                            },
                                        ]}>
                                        <Icon
                                            type={Icons.FontAwesome5}
                                            name={'book'}
                                        />
                                    </View>
                                    <CommonText>Order</CommonText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.marketContainer}>
                        <CommonText style={styles.marketTitle}>
                            Portfolios
                        </CommonText>
                    </View>
                    {topCoins.map(coin => {
                        return (
                            <View
                                style={styles.priceChartContainer}
                                key={coin.symbol}>
                                <PriceChart
                                    symbol={coin.symbol}
                                    name={coin.name}
                                    price={coin.current_price}
                                    data={coin.sparkline_in_7d.price}
                                    image={coin.image}
                                    change={coin.price_change_percentage_24h}
                                    onPress={() =>
                                        navigation.navigate(
                                            'CoinDetailScreen',
                                            {
                                                coin: coin.id,
                                                title: coin.symbol,
                                                showAdd: false,
                                            },
                                        )
                                    }
                                />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    noticeContainer: {
        height: 170,
        width: '100%',
        paddingHorizontal: 5,
    },
    featureIconContainer: {
        width: '100%',
        height: 180,
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureRow: {
        height: 85,
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    featureItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureItem: {
        width: 60,
        height: 60,
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceChartContainer: {
        height: 70,
    },
    marketContainer: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },

    marketTitle: {
        fontSize: 18,
    },
});

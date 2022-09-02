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
import {MarketAction} from '@persistence/market/MarketAction';
import {useTranslation} from 'react-i18next';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonText from '@components/commons/CommonText';
import {formatCoins, formatPrice} from '@src/utils/CurrencyUtil';
import {CHAIN_ID_MAP} from '@persistence/wallet/WalletConstant';

export default function WalletDetailScreen({navigation, route}) {
    const {item} = route.params;
    const {wallets, totalBalance} = useSelector(state => state.WalletReducer);
    const {theme} = useSelector(state => state.ThemeReducer);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {}, []);
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
                    <CommonTouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon type={Icons.Feather} name={'arrow-left'} />
                    </CommonTouchableOpacity>
                    <CommonText>{item.symbol.toUpperCase()}</CommonText>
                    <Icon
                        type={Icons.Ionicons}
                        name={'stats-chart'}
                        size={19}
                    />
                </View>
            </SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <View style={styles.scrollViewContent}>
                    <View style={styles.priceContainer}>
                        <View style={styles.pills}>
                            <CommonText
                                style={{fontSize: 12, color: theme.lighter}}>
                                {t('coindetails.price') +
                                    ': ' +
                                    formatPrice(item.price)}
                            </CommonText>
                        </View>
                        <View style={styles.pills}>
                            <CommonText
                                style={{
                                    fontSize: 12,
                                    color: theme.lighter,
                                }}>
                                {t('wallet.added_manually')}
                            </CommonText>
                        </View>
                    </View>
                </View>
                <CommonText
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.bigText}>
                    {formatPrice(item.value) || 0}
                </CommonText>
                <CommonText style={styles.coins}>
                    {formatCoins(item.balance) || 0} {item.symbol}
                </CommonText>
                <View style={styles.btnContainer}>
                    <View>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletSendScreen', {
                                    item: item,
                                });
                            }}
                            style={[
                                styles.roundBtn,
                                {backgroundColor: theme.foreground},
                            ]}>
                            <Icon
                                type={Icons.Ionicons}
                                name="arrow-up"
                                size={20}
                                color={theme.background}
                            />
                        </CommonTouchableOpacity>
                        <CommonText style={styles.round}>
                            {t('wallet.send')}
                        </CommonText>
                    </View>
                    <View>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletReceiveScreen', {
                                    item: item,
                                });
                            }}
                            style={[
                                styles.roundBtn,
                                {backgroundColor: theme.foreground},
                            ]}>
                            <Icon
                                name="arrow-down"
                                size={20}
                                type={Icons.Ionicons}
                                color={theme.background}
                            />
                        </CommonTouchableOpacity>
                        <CommonText style={styles.round}>
                            {t('wallet.receive')}
                        </CommonText>
                    </View>
                    {CHAIN_ID_MAP[item.chain] && (
                        <View>
                            <CommonTouchableOpacity
                                style={[
                                    styles.roundBtn,
                                    {backgroundColor: theme.foreground},
                                ]}>
                                <Icon
                                    type={Icons.FontAwesome}
                                    name="exchange"
                                    size={18}
                                    color={theme.background}
                                />
                            </CommonTouchableOpacity>
                            <CommonText style={styles.round}>
                                {t('hub.swap')}
                            </CommonText>
                        </View>
                    )}

                    <View>
                        <CommonTouchableOpacity
                            style={[
                                styles.roundBtn,
                                {backgroundColor: theme.foreground},
                            ]}>
                            <Icon
                                type={Icons.FontAwesome}
                                name="dollar"
                                size={20}
                                color={theme.background}
                            />
                        </CommonTouchableOpacity>
                        <CommonText style={styles.round}>
                            {t('wallet.buysell')}
                        </CommonText>
                    </View>
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
});

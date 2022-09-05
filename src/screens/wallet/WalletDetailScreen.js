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

export default function WalletDetailScreen({navigation, route}) {
    const {item} = route.params;
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
                    <View style={{width: 20}}></View>
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
                                {item.name + ' ' + t('wallet.network')}
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
                                {backgroundColor: '#26A17B'},
                            ]}>
                            <Icon
                                type={Icons.Entypo}
                                name={'chevron-with-circle-up'}
                                size={24}
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
                                navigation.navigate('WalletReceiveScreen', {
                                    item: item,
                                });
                            }}
                            style={[
                                styles.roundBtn,
                                {backgroundColor: '#26A17B'},
                            ]}>
                            <Icon
                                type={Icons.Entypo}
                                name={'chevron-with-circle-down'}
                                size={24}
                                color={'white'}
                            />
                        </CommonTouchableOpacity>
                        <CommonText style={styles.round}>
                            {t('wallet.receive')}
                        </CommonText>
                    </View>
                    <View>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletBuyScreen', {
                                    item: item,
                                });
                            }}
                            style={[
                                styles.roundBtn,
                                {backgroundColor: '#26A17B'},
                            ]}>
                            <Icon
                                type={Icons.Entypo}
                                name={'credit-card'}
                                size={24}
                                color={'white'}
                            />
                        </CommonTouchableOpacity>
                        <CommonText style={styles.round}>
                            {t('wallet.buysell')}
                        </CommonText>
                    </View>
                    <View>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('WalletTransactionScreen', {
                                    item: item,
                                });
                            }}
                            style={[
                                styles.roundBtn,
                                {backgroundColor: '#26A17B'},
                            ]}>
                            <Icon
                                type={Icons.FontAwesome}
                                name={'history'}
                                size={24}
                                color={'white'}
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

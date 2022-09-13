import React, {createRef, useCallback, useEffect, useState} from 'react';
import {RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {WalletAction} from '@persistence/wallet/WalletAction';
import Icon, {Icons} from '@components/icons/Icons';
import {MarketAction} from '@persistence/market/MarketAction';
import CommonText from '@components/commons/CommonText';
import Balance from '@components/Balance';
import CommonFlatList from '@components/commons/CommonFlatList';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import {formatCoins, formatPrice} from '@src/utils/CurrencyUtil';
import ActionSheet from 'react-native-actions-sheet/src';
import {useTranslation} from 'react-i18next';

const actionSheetRef = createRef();
export default function WalletScreen({navigation, route}) {
    const {wallets} = useSelector(state => state.WalletReducer);
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const {t} = useTranslation();
    const [platforms, setPlatforms] = useState([]);
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
    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity
                onPress={() => {
                    navigation.navigate('WalletDetailScreen', {item: item});
                }}
                style={{height: 80, marginVertical: 3}}>
                <View style={styles.container}>
                    <View style={[styles.card, {backgroundColor: theme.card}]}>
                        {item.type === 'coin' ? (
                            <View style={styles.verticalLine} />
                        ) : null}
                        <View style={styles.logo}>
                            <CommonImage
                                style={styles.logoimg}
                                source={{
                                    uri: item.image,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable,
                                }}
                            />
                        </View>
                        <View style={styles.mcontainer}>
                            <CommonText
                                adjustsFontSizeToFit
                                numberOfLines={2}
                                style={[
                                    styles.coinName,
                                    {color: theme.foreground},
                                ]}>
                                {item.name}
                            </CommonText>
                            <View>
                                <CommonText
                                    style={styles.coinSymbol}
                                    numberOfLines={1}>
                                    {item.symbol}
                                </CommonText>
                            </View>
                        </View>
                        <View style={styles.rcontainer}>
                            <CommonText
                                style={[
                                    styles.balance,
                                    {color: theme.foreground},
                                ]}
                                numberOfLines={1}>
                                {formatCoins(item.balance) + ' ' + item.symbol}
                            </CommonText>
                            <CommonText
                                style={[styles.value, {color: theme.lighter}]}
                                numberOfLines={1}>
                                {formatPrice(item.value, true)}
                            </CommonText>
                        </View>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };

    return (
        <View style={[styles.container]}>
            <SafeAreaView>
                <View style={styles.upperHeaderPlaceholder}></View>
            </SafeAreaView>
            <SafeAreaView
                style={[styles.header, {backgroundColor: theme.background}]}>
                <View style={styles.upperHeader}>
                    <Balance />
                    <CommonTouchableOpacity
                        onPress={() => {
                            navigation.navigate('TokenScreen');
                        }}>
                        <Icon type={Icons.Feather} name={'plus'} />
                    </CommonTouchableOpacity>
                </View>
            </SafeAreaView>
            <View style={styles.scrollViewContent}>
                <View style={styles.marketContainer}>
                    <CommonText style={styles.marketTitle}>Wallets</CommonText>
                </View>
                <CommonFlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={wallets}
                    renderItem={renderItem}
                    keyExtractor={(item, index) =>
                        item.cid + item.chain + index.toString() ?? ''
                    }
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    showsVerticalScrollIndicator={false}
                    style={{marginHorizontal: 10, height: '100%'}}
                />
            </View>
            <ActionSheet
                ref={actionSheetRef}
                gestureEnabled={true}
                headerAlwaysVisible
                containerStyle={{
                    flex: 1,
                    backgroundColor: theme.background,
                }}>
                <View style={{backgroundColor: theme.background}}>
                    {route.params.isSupported && platforms.length > 0 ? (
                        <>
                            <CommonText style={styles.choose_network}>
                                {t('coindetails.choose_network')}
                            </CommonText>
                            <CommonFlatList
                                data={platforms}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                renderItem={({item}) => <View></View>}
                            />

                            <CommonText style={styles.chain_note}>
                                {t('coindetails.chain_note')}
                            </CommonText>
                        </>
                    ) : (
                        <>
                            <CommonText style={styles.choose_network}>
                                {!route.params.isSupported
                                    ? t('coindetails.not_available')
                                    : t('coindetails.already_title')}
                            </CommonText>
                            <CommonText style={styles.manual_note}>
                                {!route.params.isSupported
                                    ? t('coindetails.manual_note')
                                    : t('coindetails.already_note')}
                            </CommonText>
                        </>
                    )}
                </View>
            </ActionSheet>
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
    logoimg: {
        width: 30,
        height: 30,
        opacity: 0.9,
        justifyContent: 'center',
    },
    coinSymbol: {
        fontSize: 12,
        marginTop: 3,
    },
    chart: {
        paddingRight: 0,
        paddingBottom: 20,
        paddingTop: 20,
    },
    mcontainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 10,
        flex: 1.5,
    },
    verticalLine: {
        backgroundColor: '#EDE2C1',
        width: 2,
        height: 50,
        position: 'absolute',
        left: 0,
        top: 15,
        borderRadius: 10,
    },
    chartContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 0,
        flex: 1,
    },
    coinName: {
        fontSize: 15,
        marginBottom: 0,
        fontWeight: 'bold',
    },
    balance: {
        fontSize: 13,
        textAlign: 'right',
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        fontSize: 13,
        textAlign: 'right',
        marginTop: 5,
        marginRight: 5,
    },
    logo: {
        width: 35,
        height: 35,
        alignSelf: 'center',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    bgprice: {
        padding: 5,
        // backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 5,
    },
    rcontainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 5,
        flex: 1,
    },
    card: {
        flexDirection: 'row',
        flex: 1,
        height: 70,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    choose_network: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 25,
        fontFamily: 'RobotoSlab-Bold',
        //color: Colors.foreground,
    },
    chain_note: {
        textAlign: 'center',
        //color: Colors.lighter,
        width: '80%',
        alignSelf: 'center',
        fontSize: 12,
        marginTop: 30,
        marginBottom: 10,
    },
    manual_note: {
        textAlign: 'center',
        //color: Colors.lighter,
        width: '80%',
        alignSelf: 'center',
        fontSize: 13,
        marginTop: 0,
        marginBottom: 10,
        lineHeight: 18,
    },
});

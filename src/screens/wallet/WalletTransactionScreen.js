import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonFlatList from '@components/commons/CommonFlatList';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonImage from '@components/commons/CommonImage';
import {useTranslation} from 'react-i18next';
import {WalletService} from '@persistence/wallet/WalletService';
import Icon, {Icons} from '@components/icons/Icons';
import {formatPrice} from '@src/utils/CurrencyUtil';

export default function WalletTransactionScreen({navigation, route}) {
    const {usdtWallet} = useSelector(state => state.WalletReducer);
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const {t} = useTranslation();
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        (async () => {
            const {data} = await WalletService.getTokenTransactionsByWallet(
                usdtWallet,
            );
            setTransactions(data);
        })();
    }, []);
    const onRefresh = useCallback(async () => {
        const {data} = await WalletService.getTokenTransactionsByWallet(
            usdtWallet,
        );
        setRefreshing(false);
        setTransactions(data);
    }, []);
    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity
                style={styles.transactionItem}
                onPress={() => {
                    navigation.navigate('WalletTransactionDetailScreen', {
                        item: item,
                    });
                }}>
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
                    </CommonText>
                    <CommonText style={{fontSize: 10}}>
                        {item.tokenSymbol}
                    </CommonText>
                </View>
            </CommonTouchableOpacity>
        );
    };

    return (
        <View style={[styles.container]}>
            <SafeAreaView>
                <View style={styles.upperHeaderPlaceholder}></View>
            </SafeAreaView>
            <SafeAreaView style={[styles.header]}>
                <View style={styles.upperHeader}>
                    <CommonTouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon type={Icons.Feather} name={'arrow-left'} />
                    </CommonTouchableOpacity>
                    <CommonText>Transactions</CommonText>
                    <View style={{width: 30}}></View>
                </View>
            </SafeAreaView>
            <View style={styles.scrollViewContent}>
                <CommonFlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={item => item.hash}
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    showsVerticalScrollIndicator={false}
                    style={{marginHorizontal: 10, height: '100%'}}
                />
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
        backgroundColor: 'white',
    },
    scrollViewContent: {
        marginTop: 15,
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

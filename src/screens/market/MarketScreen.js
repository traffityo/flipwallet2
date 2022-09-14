import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import BigList from 'react-native-big-list';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {MarketAction} from '@persistence/market/MarketAction';
import CommonText from '@components/commons/CommonText';
import {formatPercentage, formatPrice} from '@src/utils/CurrencyUtil';
import {LineChart} from 'react-native-chart-kit';
import CommonLoading from '@components/commons/CommonLoading';

export default function MarketScreen({navigation, route}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {topCoins} = useSelector(state => state.MarketReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        (async () => {
            dispatch(MarketAction.getTopCoins(30));
        })();
    }, []);
    const onRefresh = useCallback(async () => {
        CommonLoading.show();
        dispatch(MarketAction.getTopCoins(30)).then(() => {
            setRefreshing(false);
            CommonLoading.hide();
        });
    }, []);
    const renderItem = ({item}) => {
        const up = item.price_change_percentage_24h >= 0 ? true : false;
        return (
            <CommonTouchableOpacity
                onPress={async () => {
                    navigation.navigate('MarketDetailScreen', {coin: item});
                }}
                style={styles.item}>
                <CommonImage
                    style={styles.img}
                    source={{
                        uri: item.image,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                />
                <View style={styles.itemContent}>
                    <View style={{width: 100}}>
                        <CommonText style={styles.itemName} numberOfLines={1}>
                            {item.name}
                        </CommonText>
                        <CommonText
                            style={[
                                styles.itemName,
                                {color: theme.text2, fontSize: 12},
                            ]}
                            numberOfLines={1}>
                            {item.symbol.toUpperCase()}
                        </CommonText>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <LineChart
                            withVerticalLabels={false}
                            withHorizontalLabels={false}
                            withHorizontalLines={false}
                            width={90}
                            height={30}
                            bezier
                            withDots={false}
                            withVerticalLines={false}
                            withOuterLines={false}
                            chartConfig={{
                                color: () => (up ? '#00ff0a' : 'red'),
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                            }}
                            style={styles.chart}
                            data={{
                                datasets: [
                                    {
                                        data: item.sparkline_in_7d.price.slice(
                                            item.sparkline_in_7d.length -
                                                Math.round(
                                                    item.sparkline_in_7d
                                                        .length / 7,
                                                ),
                                            item.sparkline_in_7d.length,
                                        ),
                                    },
                                ],
                            }}
                        />
                    </View>
                    <View style={{width: 100, alignItems: 'flex-end'}}>
                        <CommonText numberOfLines={1}>
                            {formatPrice(item.current_price)}
                        </CommonText>
                        <CommonText
                            numberOfLines={1}
                            style={{color: up ? '#00ff0a' : 'red'}}>
                            {formatPercentage(item.price_change_percentage_24h)}
                        </CommonText>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <View style={{flex: 1, marginHorizontal: 15}}>
                    <BigList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        data={topCoins}
                        renderItem={renderItem}
                        itemHeight={75}
                        insetBottom={30}
                        insetTop={10}
                        keyboardDismissMode="on-drag"
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        marginTop: 15,
    },
    customBtn: {
        //backgroundColor: Colors.darker,
        borderWidth: 0,
    },
    item: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 75,
    },
    img: {
        width: 20,
        height: 20,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        marginLeft: 10,
        fontSize: 15,
    },
    itemSymbol: {
        //color: Colors.lighter,
        fontSize: 13,
        textAlign: 'left',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    search: {
        flex: 4,
        fontSize: 16,
        borderWidth: 1,
        backgroundColor: 'red',
        paddingHorizontal: 10,
        height: 45,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    close: {
        flex: 1.2,
        height: 43,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
        borderTopEndRadius: 5,
        borderBottomEndRadius: 5,
    },
    choose_network: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 25,
    },
    chart: {
        paddingRight: 0,
        paddingBottom: 10,
        paddingTop: 10,
    },
});

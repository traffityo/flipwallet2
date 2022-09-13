import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import tokens from '@assets/json/tokens.json';
import {useTranslation} from 'react-i18next';
import BigList from 'react-native-big-list';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {MarketAction} from '@persistence/market/MarketAction';
import CommonText from '@components/commons/CommonText';
import {formatPrice} from '@src/utils/CurrencyUtil';
import {LineChart} from 'react-native-chart-kit';

export default function MarketScreen({navigation, route}) {
    const [data, setData] = useState(tokens);
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {topCoins} = useSelector(state => state.MarketReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            dispatch(MarketAction.getTopCoins(30));
        })();
    }, []);
    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity
                onPress={async () => {}}
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
                    <View>
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
                    <View style={{flex: 1, backgroundColor: 'white'}}>
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
                                color: () => 'red',
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                                fillShadowGradient: 'blue',
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
                    <View>
                        <CommonText numberOfLines={1}>
                            {formatPrice(item.current_price)}
                        </CommonText>
                        <CommonText numberOfLines={1}>
                            {item.price_change_percentage_24h}
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
        paddingBottom: 20,
        paddingTop: 20,
    },
});

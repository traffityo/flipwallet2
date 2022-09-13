import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {MarketAction} from '@persistence/market/MarketAction';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import {formatPercentage, formatPrice} from '@src/utils/CurrencyUtil';
import {LineChart} from 'react-native-chart-kit';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

export default function MarketDetailScreen({navigation, route}) {
    const {coin} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const [sparkline, setSparkline] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [labels, setLabels] = useState([]);
    useEffect(() => {
        (async () => {
            dispatch(MarketAction.getTopCoins(30));
            const line = [
                coin?.sparkline_in_7d?.price[24],
                coin?.sparkline_in_7d?.price[48],
                coin?.sparkline_in_7d?.price[72],
                coin?.sparkline_in_7d?.price[96],
                coin?.sparkline_in_7d?.price[120],
                coin?.sparkline_in_7d?.price[144],
                coin?.sparkline_in_7d?.price[167],
            ];
            setSparkline(line);
            let labels = [];
            for (let i = sparkline.length - 1; i >= 0; i--) {
                labels.push(moment().subtract(i, 'days').format('Do'));
            }
            setLabels(labels);
        })();
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <View style={styles.header}>
                    <CommonBackButton
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <CommonText>{coin.name}</CommonText>
                    <CommonTouchableOpacity
                        style={{
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Icon type={Icons.Feather} size={18} name={'heart'} />
                    </CommonTouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.coinInfo}>
                            <View style={styles.coinInfoUpperArea}>
                                <CommonImage
                                    style={styles.coinInfoImg}
                                    source={{
                                        uri: coin.image,
                                        priority: FastImage.priority.normal,
                                        cache: FastImage.cacheControl.immutable,
                                    }}
                                />
                                <CommonText
                                    style={[
                                        styles.coinInfoSymbol,
                                        {color: theme.text2},
                                    ]}>
                                    {coin.symbol.toUpperCase()}
                                </CommonText>
                            </View>
                            <View style={styles.coinInfoLowerArea}>
                                <CommonText style={styles.coinInfoPrice}>
                                    {formatPrice(coin.current_price)}
                                </CommonText>
                                <View style={styles.coinInfoPercentage}>
                                    <View style={styles.coinInfoPercentageBg}>
                                        <CommonText
                                            style={{
                                                color:
                                                    coin.price_change_percentage_24h >=
                                                    0
                                                        ? '#00FF27FF'
                                                        : 'red',
                                            }}>
                                            {formatPercentage(
                                                coin.price_change_percentage_24h,
                                            )}
                                        </CommonText>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.coinChart}>
                            <LineChart
                                data={{
                                    labels: labels,
                                    datasets: [
                                        {
                                            data: sparkline,
                                        },
                                    ],
                                }}
                                width={Dimensions.get('window').width - 25} // from react-native
                                height={220}
                                yAxisLabel="$"
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    decimalPlaces:
                                        coin.current_price >= 10000 ? 0 : 2, // optional, defaults to 2dp
                                    color: (opacity = 1) =>
                                        coin.price_change_percentage_24h >= 0
                                            ? '#00FF27FF'
                                            : 'red',
                                    labelColor: (opacity = 1) =>
                                        `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    propsForDots: {
                                        r: '6',
                                        strokeWidth: '2',
                                        stroke: '#ffa726',
                                    },
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                            />
                            <CommonText style={styles.last7DaysText}>
                                {t('coindetails.last_7_days')}
                            </CommonText>
                        </View>
                        <View style={styles.coinStatistic}>
                            <View style={styles.coinStatisticHeader}>
                                <CommonText style={styles.coinStatisticTitle}>
                                    Statistic
                                </CommonText>
                                <View>
                                    <CommonText
                                        style={[
                                            styles.coinStatisticSubtitle,
                                            {color: theme.text2},
                                        ]}>
                                        Last updated:{' '}
                                        {moment(coin.last_updated).fromNow()}
                                    </CommonText>
                                    <CommonText
                                        style={[
                                            styles.coinStatisticSubtitle,
                                            {
                                                color: theme.text2,
                                                textAlign: 'right',
                                            },
                                        ]}>
                                        by CoinGecko
                                    </CommonText>
                                </View>
                            </View>

                            <View style={styles.coinStatisticItem}>
                                <CommonText>{t('coindetails.rank')}</CommonText>
                                <CommonText>
                                    {coin?.market_cap_rank ?? '-'}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.marketcap')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(coin?.market_cap ?? '-')}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.volume')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(coin?.total_volume ?? '-')}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.all_time_high')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(coin?.ath ?? '-')}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.high_24')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(coin?.high_24h ?? '-')}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.low_24h')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(coin?.low_24h ?? '-')}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.circulating_supply')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(
                                        coin?.circulating_supply ?? '-',
                                    )}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.max_supply')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(coin?.max_supply ?? '-')}
                                </CommonText>
                            </View>
                            <View style={styles.coinStatisticItem}>
                                <CommonText>
                                    {t('coindetails.total_supply')}
                                </CommonText>
                                <CommonText>
                                    {formatPrice(coin?.total_supply ?? '-')}
                                </CommonText>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
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
        padding: 10,
    },
    coinInfo: {
        width: '100%',
        height: 70,
        paddingHorizontal: 10,
    },
    coinInfoUpperArea: {
        height: 42,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    coinInfoImg: {
        height: 32,
        width: 32,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    coinInfoSymbol: {
        fontWeight: 'bold',
        marginLeft: 5,
    },
    coinInfoLowerArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinInfoPrice: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    coinInfoPercentage: {
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinInfoPercentageBg: {
        backgroundColor: 'rgba(126,126,126,0.5)',
        borderRadius: 10,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinChart: {
        height: 240,
        width: '100%',
        paddingTop: 10,
    },
    last7DaysText: {
        color: 'gray',
        textAlign: 'center',
        fontSize: 30,
        position: 'absolute',
        fontWeight: 'bold',
        opacity: 0.2,
        width: '100%',
        top: 80,
        left: 30,
    },
    coinStatistic: {
        width: '100%',
        flex: 1,
        padding: 10,
    },
    coinStatisticHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinStatisticTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    coinStatisticItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 55,
        borderBottomWidth: 0.5,
    },
    coinStatisticSubtitle: {
        fontSize: 10,
    },
});

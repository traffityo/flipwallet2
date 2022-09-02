import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useSelector} from 'react-redux';
import CommonImage from '@components/commons/CommonImage';
import FastImage from 'react-native-fast-image';
import CommonText from '@components/commons/CommonText';
import {LineChart} from 'react-native-chart-kit';
import {formatPrice} from '@src/utils/CurrencyUtil';

function PriceChart({symbol, name, price, data, image, change, onPress}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <CommonTouchableOpacity onPress={onPress ? onPress : null}>
            <View style={styles.container}>
                <View style={[styles.card, {backgroundColor: theme.card}]}>
                    <View
                        style={[
                            styles.logo,
                            {backgroundColor: theme.background},
                        ]}>
                        <CommonImage
                            style={styles.logoimg}
                            source={{
                                uri: image,
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
                            {name}
                        </CommonText>
                        <CommonText
                            style={[styles.coinSymbol, {color: theme.lighter}]}>
                            {symbol.toUpperCase()}
                        </CommonText>
                    </View>
                    <View style={styles.chartContainer}>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
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
                                    color: () => {
                                        return change > 0
                                            ? '#5cb85c'
                                            : '#d9534f';
                                    },
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    fillShadowGradient: theme.background,
                                }}
                                style={styles.chart}
                                data={{
                                    datasets: [
                                        {
                                            data: data.slice(
                                                data.length -
                                                    Math.round(data.length / 7),
                                                data.length,
                                            ),
                                        },
                                    ],
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.rcontainer}>
                        <View
                            style={[
                                styles.bgprice,
                                {backgroundColor: theme.background},
                            ]}>
                            <CommonText
                                style={[
                                    styles.price,
                                    {color: theme.foreground},
                                ]}>
                                {formatPrice(price)}
                            </CommonText>
                        </View>
                        <CommonText
                            style={[
                                styles.price,
                                {
                                    color: change > 0 ? '#5cb85c' : '#d9534f',
                                },
                            ]}>
                            {change.toFixed(2)}%
                        </CommonText>
                    </View>
                </View>
            </View>
        </CommonTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    logoimg: {
        width: 30,
        height: 30,
        justifyContent: 'center',
    },
    coinSymbol: {
        fontSize: 13,
        marginBottom: 5,
        // fontFamily: 'RobotoSlab-Regular',
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
        flex: 1,
    },
    chartContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 0,
        flex: 1,
    },
    coinName: {
        fontSize: 15,
        marginBottom: 2,
        fontWeight: 'bold',
        // fontFamily: 'RobotoSlab-Bold',
    },
    price: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 3,
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
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    rcontainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 15,
        flex: 0.9,
    },
    card: {
        flexDirection: 'row',
        flex: 1,
        height: 90,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        marginHorizontal: 5,
        marginVertical: 3,
    },
});

export default PriceChart;

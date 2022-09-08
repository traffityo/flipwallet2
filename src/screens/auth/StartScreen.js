import React from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';

const data = [
    {
        type: 'Bitcoin',
        imageUri: require('@assets/btc.png'),
        heading: 'High durability',
        description: 'Using bitcoin increases the ease of doing transactions.',
        key: 'first',
        color: '#f59119',
    },
    {
        type: 'Ethereum',
        imageUri: require('@assets/eth.png'),
        heading: 'Decentralization',
        description:
            'Ethereum is the second most decentralized cryptocurrency in the world, after Bitcoin.',
        key: 'third',
        color: '#505050',
    },
    {
        type: 'Smart Chain',
        imageUri: require('@assets/bnb.png'),
        heading: 'Secure',
        description:
            "BNB Chain's system has its benefits such as fast transactions and low gas fees.",
        key: 'second',
        color: '#f5b92d',
    },
    {
        type: 'Polygon',
        imageUri: require('@assets/polygon.png'),
        heading: 'Layer 2 solution',
        description:
            'Using Polygon, users can interact with any decentralized application (DApp) without ever having to worry about network congestion.',
        key: 'fourth',
        color: '#f04187',
    },
];

const {width, height} = Dimensions.get('window');
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 40;
const CIRCLE_SIZE = width * 0.6;

const Circle = ({scrollX}) => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
            {data.map(({color}, index) => {
                const inputRange = [
                    (index - 0.55) * width,
                    index * width,
                    (index + 0.55) * width,
                ];
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0, 0.2, 0],
                });
                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.circle,
                            {
                                backgroundColor: color,
                                opacity,
                                transform: [{scale}],
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const Ticker = ({scrollX}) => {
    const inputRange = [-width, 0, width];
    const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
    });
    return (
        <View style={styles.tickerContainer}>
            <Animated.View style={{transform: [{translateY}]}}>
                {data.map(({type}, index) => {
                    return (
                        <Text key={index} style={styles.tickerText}>
                            {type}
                        </Text>
                    );
                })}
            </Animated.View>
        </View>
    );
};

const Item = ({imageUri, heading, description, index, scrollX}) => {
    const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
    ];
    const inputRangeOpacity = [
        (index - 0.3) * width,
        index * width,
        (index + 0.3) * width,
    ];
    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
    });
    const translateXHeading = scrollX.interpolate({
        inputRange,
        outputRange: [width * 0.1, 0, -width * 0.1],
    });
    const translateXDescription = scrollX.interpolate({
        inputRange,
        outputRange: [width * 0.7, 0, -width * 0.7],
    });
    const opacity = scrollX.interpolate({
        inputRange: inputRangeOpacity,
        outputRange: [0, 1, 0],
    });
    const navigation = useNavigation();
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <View style={styles.itemStyle}>
            <Animated.Image
                source={imageUri}
                style={[
                    styles.imageStyle,
                    {
                        transform: [{scale}],
                    },
                ]}
            />
            <View style={styles.textContainer}>
                <Animated.Text
                    style={[
                        styles.heading,
                        {
                            opacity,
                            transform: [{translateX: translateXHeading}],
                        },
                    ]}>
                    {heading}
                </Animated.Text>
                <View style={{height: Platform.OS === 'ios' ? 120 : 80}}>
                    <Animated.Text
                        style={[
                            styles.description,
                            {
                                opacity,
                                transform: [
                                    {
                                        translateX: translateXDescription,
                                    },
                                ],
                            },
                        ]}>
                        {description}
                    </Animated.Text>
                </View>
                <Animated.Text
                    style={[
                        styles.heading,
                        {
                            opacity,
                            transform: [{translateX: translateXHeading}],
                        },
                        {
                            color: theme.text,
                        },
                    ]}>
                    <CommonText
                        onPress={() => {
                            navigation.navigate('SetPinCodeScreen', {
                                new: true,
                            });
                        }}>
                        Create{' '}
                    </CommonText>
                    <CommonText style={{textTransform: 'lowercase'}}>
                        or
                    </CommonText>{' '}
                    <CommonText
                        onPress={() => {
                            navigation.navigate('SetPinCodeScreen', {
                                new: false,
                            });
                        }}>
                        Import{' '}
                    </CommonText>
                </Animated.Text>
            </View>
        </View>
    );
};

const Pagination = ({scrollX}) => {
    const inputRange = [-width, 0, width];
    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [-DOT_SIZE, 0, DOT_SIZE],
    });
    return (
        <View style={[styles.pagination]}>
            <Animated.View
                style={[
                    styles.paginationIndicator,
                    {
                        position: 'absolute',
                        transform: [{translateX}],
                    },
                ]}
            />
            {data.map(item => {
                return (
                    <View key={item.key} style={styles.paginationDotContainer}>
                        <View
                            style={[
                                styles.paginationDot,
                                {backgroundColor: item.color},
                            ]}
                        />
                    </View>
                );
            })}
        </View>
    );
};

export default function StartScreen() {
    const scrollX = React.useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <Circle scrollX={scrollX} />
            <Animated.FlatList
                keyExtractor={item => item.key}
                data={data}
                renderItem={({item, index}) => (
                    <Item {...item} index={index} scrollX={scrollX} />
                )}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: true},
                )}
                scrollEventThrottle={16}
            />
            <Image
                style={styles.logo}
                source={require('@assets/ue_black_logo.png')}
            />

            <Pagination scrollX={scrollX} />
            <Ticker scrollX={scrollX} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemStyle: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        width: width * 0.75,
        height: width * 0.75,
        resizeMode: 'contain',
        flex: 1,
    },
    textContainer: {
        alignItems: 'flex-start',
        alignSelf: 'flex-end',
        flex: 0.5,
    },
    heading: {
        color: '#444',
        textTransform: 'uppercase',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 5,
    },
    description: {
        color: '#ccc',
        fontWeight: '600',
        textAlign: 'left',
        width: width * 0.75,
        marginRight: 10,
        fontSize: 16,
        lineHeight: 16 * 1.5,
    },
    logo: {
        opacity: 0.9,
        height: LOGO_HEIGHT,
        width: LOGO_WIDTH,
        resizeMode: 'contain',
        position: 'absolute',
        left: 10,
        bottom: 10,
        transform: [
            {translateX: -LOGO_WIDTH / 2},
            {translateY: -LOGO_HEIGHT / 2},
            {rotateZ: '-90deg'},
            {translateX: LOGO_WIDTH / 2},
            {translateY: LOGO_HEIGHT / 2},
        ],
    },
    pagination: {
        position: 'absolute',
        right: 20,
        bottom: 40,
        flexDirection: 'row',
        height: DOT_SIZE,
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
    },
    paginationDotContainer: {
        width: DOT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationIndicator: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    tickerContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        overflow: 'hidden',
        height: TICKER_HEIGHT,
    },
    tickerText: {
        fontSize: TICKER_HEIGHT,
        lineHeight: TICKER_HEIGHT,
        textTransform: 'uppercase',
        fontWeight: '800',
    },

    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute',
        top: '15%',
    },
    buttonContainer: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 60,
        left: 85,
    },
    button: {
        width: 280,
        height: 50,
        backgroundColor: '#9dcdfa',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,

        elevation: 21,
    },
    buttonTxt: {
        color: 'white',
        fontWeight: 'bold',
    },
});

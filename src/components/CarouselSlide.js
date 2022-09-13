import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonImage from '@components/commons/CommonImage';
import {formatPrice} from '@src/utils/CurrencyUtil';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useNavigation} from '@react-navigation/native';

const SLIDE_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SLIDE_WIDTH * 0.85;
export default function CarouselSlide() {
    const {wallets} = useSelector(state => state.WalletReducer);
    const navigation = useNavigation();
    const renderItem = ({item, index}, parallaxProps) => {
        let image = null;
        switch (index) {
            case 0:
                image = require('@assets/card2.png');
                break;
            case 1:
                image = require('@assets/card1.png');
                break;
            case 2:
                image = require('@assets/card3.png');
                break;
            case 3:
                image = require('@assets/card4.png');
                break;
        }
        return (
            <CommonTouchableOpacity
                style={[styles.item]}
                onPress={() => {
                    navigation.navigate('WalletDetailScreen', {coin: item});
                }}>
                <ParallaxImage
                    source={image}
                    containerStyle={styles.imageContainer}
                    style={styles.itemImg}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                <View style={styles.itemContainer}>
                    <View style={styles.itemInfo}>
                        <CommonText>{item.name}</CommonText>
                        <CommonImage
                            source={{uri: item.image}}
                            style={{width: 48, height: 48}}
                        />
                    </View>
                    <View style={[styles.itemInfo, {marginTop: 50}]}>
                        <View>
                            <CommonText>{item.symbol} Balance:</CommonText>
                            <CommonText style={styles.itemValue}>
                                {formatPrice(item.value, true)}
                            </CommonText>
                        </View>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };
    return (
        <Carousel
            data={wallets}
            renderItem={renderItem}
            sliderWidth={SLIDE_WIDTH}
            itemWidth={ITEM_WIDTH}
            useScrollView={true}
            hasParallaxImages={true}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        width: ITEM_WIDTH,
        height: 180,
    },
    itemImg: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    imageContainer: {
        height: '100%',
        width: '100%',
        marginBottom: Platform.select({ios: 0, android: 1}),
        borderRadius: 10,
        position: 'absolute',
    },
    itemContainer: {
        flex: 1,
        padding: 15,
    },
    itemInfo: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemValue: {
        fontSize: 30,
    },
});

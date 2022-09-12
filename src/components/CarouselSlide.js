import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

const SLIDE_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SLIDE_WIDTH * 0.85;
const data = [
    {id: '12345', image: require('@assets/card1.png')},
    {id: '123455', image: require('@assets/card2.png')},
    {id: '123453', image: require('@assets/card3.png')},
    {id: '1234345', image: require('@assets/card4.png')},
];

export default function CarouselSlide() {
    const renderItem = ({item, index}, parallaxProps) => {
        return (
            <View style={[styles.item]}>
                <ParallaxImage
                    source={item.image}
                    containerStyle={styles.imageContainer}
                    style={styles.itemImg}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
            </View>
        );
    };
    return (
        <Carousel
            data={data}
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
        flex: 1,
        marginBottom: Platform.select({ios: 0, android: 1}),
        borderRadius: 10,
    },
});

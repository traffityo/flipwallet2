import * as React from 'react';
import {useState} from 'react';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import CommonText from '@components/commons/CommonText';

const ENTRIES1 = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration:
            'https://public.bnbstatic.com/image/cms/blog/20220831/bfa2b581-8f41-4a01-a0a9-61a09125689c.jpg',
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration:
            'https://public.bnbstatic.com/image/cms/blog/20220831/ec94475a-35f6-48af-a0bb-ee4e667b13e8.jpg',
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration:
            'https://public.bnbstatic.com/image/cms/blog/20220830/32fe4e19-f6cc-4c79-bcb9-b049438cebdb.png',
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration:
            'https://public.bnbstatic.com/image/cms/blog/20220830/add15769-4868-4125-952d-3b06a94e29d0.jpg',
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration:
            'https://public.bnbstatic.com/image/cms/blog/20220829/bcc74c78-24ac-454d-92ac-372db5932ad3.png',
    },
];

function NoticeSlider() {
    const renderItem = ({item, index}, parallaxProps) => {
        return (
            <View style={[styles.item]}>
                <ParallaxImage
                    source={{uri: item.illustration}}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                <CommonText style={styles.title} numberOfLines={2}>
                    {item.title}
                </CommonText>
            </View>
        );
    };
    const [activeSlide, setActiveSlide] = useState(0);
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 5,
            }}>
            <Carousel
                layout={'default'}
                data={ENTRIES1}
                renderItem={renderItem}
                sliderWidth={Dimensions.get('window').width - 10}
                itemWidth={Dimensions.get('window').width - 10}
                autoplay={true}
                autoplayInterval={5000}
                loop={true}
                onSnapToItem={index => setActiveSlide(index)}
                hasParallaxImages={true}
            />
            <Pagination
                dotsLength={ENTRIES1.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                    position: 'absolute',
                    bottom: 25,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                }}
                inactiveDotStyle={
                    {
                        // Define styles for inactive dots here
                    }
                }
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5,
    },
    item: {
        height: '100%',
        width: '100%',
        paddingHorizontal: 5,
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'stretch',
    },
});

export default NoticeSlider;

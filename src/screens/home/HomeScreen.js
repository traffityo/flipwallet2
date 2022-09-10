import React, {useRef} from 'react';
import {Animated, SafeAreaView, StyleSheet, View} from 'react-native';
import Wallet from '@components/Wallet';
import {faker} from '@faker-js/faker';
import CommonImage from '@components/commons/CommonImage';

faker.seed(10);
const DATA2 = [...Array(30).keys()].map((_, i) => {
    return {
        key: faker.datatype.uuid(),
        image: faker.image.cats(),
        name: faker.internet.userName(),
        jobTitle: faker.name.jobTitle(),
        email: faker.internet.email(),
    };
});
const SPACING2 = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING2 * 3;
export default function HomeScreen() {
    const scrollY = useRef(new Animated.Value(0)).current;
    return (
        <SafeAreaView>
            <View style={{height: 260}}>
                <Wallet />
            </View>
            <SafeAreaView
                style={{
                    height: '100%',
                }}>
                <Animated.FlatList
                    data={DATA2}
                    keyExtractor={(_, index) => String(index)}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        padding: SPACING2,
                    }}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                        {useNativeDriver: true},
                    )}
                    renderItem={({item, index}) => {
                        const inputRange = [
                            -1,
                            0,
                            ITEM_SIZE * index,
                            ITEM_SIZE * (index + 0.5),
                        ];
                        const opacityInputRange = [
                            -1,
                            0,
                            ITEM_SIZE * index,
                            ITEM_SIZE * (index + 1),
                        ];
                        const scale = scrollY.interpolate({
                            inputRange: inputRange,
                            outputRange: [1, 1, 1, 0],
                        });
                        const opacity = scrollY.interpolate({
                            inputRange: opacityInputRange,
                            outputRange: [1, 1, 1, 0],
                        });
                        return (
                            <Animated.View
                                style={{
                                    flexDirection: 'row',
                                    padding: SPACING2,
                                    marginBottom: SPACING2,
                                    transform: [{scale}],
                                    backgroundColor: 'red',
                                    opacity,
                                }}>
                                <CommonImage
                                    source={{uri: item.image}}
                                    style={{
                                        height: AVATAR_SIZE,
                                        width: AVATAR_SIZE,
                                    }}
                                />
                            </Animated.View>
                        );
                    }}
                />
            </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

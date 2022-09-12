import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import tokens from '@assets/json/tokens.json';
import {useTranslation} from 'react-i18next';
import BigList from 'react-native-big-list';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

export default function TokenScreen({navigation, route}) {
    const [data, setData] = useState(tokens);
    const [showScreen, setShowScreen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);

    useEffect(() => {
        (async () => {})();
    }, []);

    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity onPress={() => {}} style={styles.item}>
                <CommonImage
                    style={styles.img}
                    source={{
                        uri: item.thumb,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                />
                <View style={styles.itemContent}>
                    <CommonText style={styles.itemName} numberOfLines={1}>
                        {item.name}
                    </CommonText>
                    <CommonText style={styles.itemSymbol} numberOfLines={1}>
                        {item.symbol.toUpperCase()}
                    </CommonText>
                </View>
            </CommonTouchableOpacity>
        );
    };
    const searchCoin = text => {
        let coinsList = data;
        if (text.length === 0) {
            setData(tokens);
            return;
        }
        if (text.length < searchText.length) {
            coinsList = tokens;
        }
        setSearchText(text);
        const newData = coinsList.filter(item => {
            const itemData = `${item.name.toUpperCase()}
      ${item.symbol.toUpperCase()}`;

            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        setData(newData);
    };
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[
                            styles.search,
                            {
                                backgroundColor: theme.gradientSecondary,
                                color: theme.text,
                            },
                        ]}
                        autoCorrect={false}
                        placeholderTextColor={'gray'}
                        onChangeText={text => searchCoin(text)}
                        placeholder={t('search.search_assets')}
                    />

                    <CommonTouchableOpacity
                        style={[
                            styles.close,
                            {backgroundColor: theme.gradientSecondary},
                        ]}
                        onPress={() => navigation.goBack()}>
                        <CommonText
                            style={{
                                color: theme.text,
                                fontWeight: 'bold',
                            }}>
                            {t('settings.cancel')}
                        </CommonText>
                    </CommonTouchableOpacity>
                </View>
                <View style={{flex: 1, marginHorizontal: 15}}>
                    <BigList
                        data={data}
                        renderItem={renderItem}
                        itemHeight={60}
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
        flex: 1,
        borderBottomWidth: 0.5,
        //borderBottomColor: Colors.brick,
        paddingVertical: 10,
        alignItems: 'center',
    },
    img: {
        width: 20,
        height: 20,
        marginRight: 0,
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        flex: 5,
        //color: Colors.foreground,
        marginLeft: 10,
        fontSize: 17,
    },
    itemSymbol: {
        flex: 1,
        //color: Colors.lighter,
        marginLeft: 10,
        fontSize: 13,
        textAlign: 'right',
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
});

import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import tokens from '@data/all.json';
import all from '@assets/json/tokens.json';
import {useTranslation} from 'react-i18next';
import BigList from 'react-native-big-list';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import CommonLoading from '@components/commons/CommonLoading';
import {WalletRepository} from '@persistence/wallet/WalletRepository';
import {WalletService} from '@persistence/wallet/WalletService';
import ActionSheet from 'react-native-actions-sheet';
import CommonFlatList from '@components/commons/CommonFlatList';
import {WalletAction} from '@persistence/wallet/WalletAction';
import erc20 from '@data/polygon.json';
import _ from 'lodash';
import {Logs} from '@modules/log/logs';

export default function TokenScreen({navigation, route}) {
    const [data, setData] = useState(tokens);
    const [searchText, setSearchText] = useState('');
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {wallets} = useSelector(state => state.WalletReducer);
    const [coinData, setCoinData] = useState();
    const [platforms, setPlatforms] = useState([]);
    const dispatch = useDispatch();
    const actionSheetRef = useRef();
    useEffect(() => {
        (async () => {})();
    }, []);
    const getToken = () => {
        const allTokens = [];
        for (let i = 0; i < erc20.length; i++) {
            const isExisted = _.find(all, {symbol: erc20[i].symbol});
            if (!_.isNil(isExisted)) {
                const newToken = {
                    id: erc20[i].id,
                    symbol: erc20[i].symbol,
                    name: erc20[i].name,
                    address: erc20[i].address,
                    decimals: erc20[i].decimals,
                    chainId: erc20[i].chainId,
                    thumb: isExisted.thumb,
                };
                allTokens.push(newToken);
            }
        }
        console.log(JSON.stringify(allTokens));
    };
    const getData = () => {
        const allTokens = [];
        for (let i = 0; i < erc20.length; i++) {
            const isExisted = _.find(tokens, {symbol: erc20[i].symbol});
            if (!_.isNil(isExisted)) {
                const isChain = _.find(isExisted.platforms, {chain: 'POLYGON'});
                if (_.isNil(isChain)) {
                    const newToken = {
                        id: erc20[i].id,
                        symbol: erc20[i].symbol,
                        name: erc20[i].name,
                        thumb: erc20[i].thumb,
                        platforms: [
                            ...isExisted.platforms,
                            {chain: 'POLYGON', contract: erc20[i].address},
                        ],
                    };
                    allTokens.push(newToken);
                }
            } else {
                // const newToken = {
                //     id: erc20[i].id,
                //     symbol: erc20[i].symbol,
                //     name: erc20[i].name,
                //     thumb: erc20[i].thumb,
                //     platforms: [{chain: 'POLYGON', contract: erc20[i].address}],
                // };
                // allTokens.push(newToken);
            }
        }
        console.log('ALL');
        console.log(JSON.stringify([...tokens, ...allTokens]));
    };
    const getCoinDetail = async item => {
        try {
            const coinRes = await WalletRepository.getCoinDetails(item.id);
            return coinRes;
        } catch (e) {
            CommonLoading.hide();
        }
    };
    const chooseToken = async item => {
        try {
            let mappedPlatforms = [];
            for (let i = 0; i < item.platforms.length; i++) {
                let isExisted = false;
                for (let j = 0; j < wallets.length; j++) {
                    if (
                        wallets[j].chain === item.platforms[i].chain &&
                        wallets[j].contract &&
                        wallets[j].contract.toLowerCase() ===
                            item.platforms[i].contract
                    ) {
                        isExisted = true;
                        break;
                    }
                }
                if (!isExisted) {
                    mappedPlatforms.push(item.platforms[i]);
                }
            }
            setPlatforms(mappedPlatforms);
            setCoinData(item);
            actionSheetRef.current?.setModalVisible(true);
        } catch (e) {
            Logs.info(e);
        }
    };
    const saveWallet = (platform, contract, external) => {
        CommonLoading.show();
        dispatch(
            WalletAction.addWallet(coinData, platform, contract, external),
        ).then(({success}) => {
            CommonLoading.hide();
            if (success) {
                if (!external) {
                    // Remove the added platform from the availability list to add
                    setPlatforms(platforms.filter(o => o.chain !== platform));
                }
                actionSheetRef.current?.setModalVisible(false);
                showMessage({
                    message: t('message.wallet.token.added'),
                    type: 'success',
                });
                navigation.goBack();
            }
        });
    };
    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity
                onPress={async () => {
                    await chooseToken(item);
                }}
                style={styles.item}>
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
                <ActionSheet
                    ref={actionSheetRef}
                    gestureEnabled={true}
                    headerAlwaysVisible
                    containerStyle={{
                        flex: 1,
                        backgroundColor: theme.gradientPrimary,
                    }}>
                    <LinearGradient
                        colors={[
                            theme.gradientPrimary,
                            theme.gradientSecondary,
                        ]}>
                        <CommonText style={styles.choose_network}>
                            {t('coindetails.choose_network')}
                        </CommonText>
                        <CommonFlatList
                            data={platforms}
                            keyExtractor={item => item.chain}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) => {
                                const network =
                                    WalletService.getSupportedChainNameByID(
                                        item.chain,
                                    );
                                return (
                                    <CommonTouchableOpacity
                                        style={styles.chooseItem}
                                        onPress={() => {
                                            saveWallet(
                                                item.chain,
                                                item.contract,
                                                false,
                                            );
                                        }}>
                                        <CommonText
                                            style={styles.chooseItemText}>
                                            {network}
                                        </CommonText>
                                    </CommonTouchableOpacity>
                                );
                            }}
                        />
                    </LinearGradient>
                </ActionSheet>
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
    choose_network: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 25,
    },
    chooseItem: {
        height: 40,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 5,
        justifyContent: 'center',
        borderBottomWidth: 0.5,
    },
    chooseItemText: {
        fontWeight: 'bold',
    },
});

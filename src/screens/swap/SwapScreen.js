import React, {useEffect} from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import CommonImage from '@components/commons/CommonImage';
import Icon, {Icons} from '@components/icons/Icons';

export default function SwapScreen({navigation, route}) {
    const {coin} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const copyToClipboard = async data => {
        await Clipboard.setString(data);
    };
    const shareAddress = async () => {
        await Share.open({
            title: '',
            message: coin.walletAddress,
        });
    };
    useEffect(() => {
        (async () => {})();
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <View style={styles.header}>
                    <View style={styles.headerPriceContainer}>
                        <CommonBackButton
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    </View>
                    <CommonText>{coin.name}</CommonText>
                    <View style={styles.headerPriceContainer}></View>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.gradientSecondary},
                            ]}>
                            <TextInput
                                style={styles.input}
                                onChangeText={v => {}}
                                value={''}
                                placeholder={t('tx.destination_address')}
                                numberOfLines={1}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                            />
                            <CommonTouchableOpacity
                                onPress={async () => {}}
                                style={styles.tokenContainer}>
                                <CommonImage
                                    source={{uri: coin.image}}
                                    style={styles.tokenImg}
                                />
                                <CommonText>{coin.symbol}</CommonText>
                            </CommonTouchableOpacity>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.gradientSecondary},
                            ]}>
                            <TextInput
                                style={styles.input}
                                onChangeText={v => {}}
                                value={''}
                                placeholder={t('tx.destination_address')}
                                numberOfLines={1}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                            />
                            <CommonTouchableOpacity
                                onPress={async () => {}}
                                style={styles.tokenContainer}>
                                <View style={styles.tokenImg}>
                                    <Icon
                                        name="plus"
                                        size={21}
                                        type={Icons.Feather}
                                    />
                                </View>
                                <CommonText>Select</CommonText>
                            </CommonTouchableOpacity>
                        </View>
                        <CommonTouchableOpacity
                            style={[
                                styles.exchangeContainer,
                                {
                                    backgroundColor: theme.gradientSecondary,
                                    borderColor: theme.gradientPrimary,
                                    borderWidth: 0.5,
                                },
                            ]}>
                            <Icon
                                name="swap-vertical"
                                size={21}
                                type={Icons.MaterialCommunityIcons}
                            />
                        </CommonTouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingHorizontal: 10,
        alignItems: 'center',
        height: Dimensions.get('window').height - 158,
        marginTop: 20,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    qrCode: {
        minHeight: 280,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 3,
        borderRadius: 10,
    },
    qrCodeHeader: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrCodeFooter: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    description: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controls: {
        width: '40%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    element: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    elementIcon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginBottom: 5,
    },
    headerPriceContainer: {
        width: 70,
    },
    inputView: {
        height: 70,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 14,
        marginVertical: 10,
        marginBottom: 0,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {flex: 1, color: 'white'},
    tokenContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        width: 70,
    },
    tokenImg: {
        width: 24,
        height: 24,
        borderRadius: 50,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exchangeContainer: {
        height: 32,
        width: 32,
        borderRadius: 5,
        position: 'absolute',
        top: 70,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
});

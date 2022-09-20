import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {PinCode} from '@components/PinCode';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COIN_LIST} from '@persistence/wallet/WalletConstant';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {UserAction} from '@persistence/user/UserAction';
import {WalletAction} from '@persistence/wallet/WalletAction';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import CommonLoading from '@components/commons/CommonLoading';
import LinearGradient from 'react-native-linear-gradient';

const SetPinCodeScreen = ({route}) => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {theme} = useSelector(state => state.ThemeReducer);
    useEffect(() => {}, []);

    const success = async () => {
        const goTo = route.params.new ? 'GenerateWalletScreen' : 'ImportScreen';
        if (goTo === 'GenerateWalletScreen') {
            let newMnemonic;
            try {
                const words = 12; // or 24
                newMnemonic = await generateMnemonic(words);
            } catch (error) {
                newMnemonic = WalletGenerator.generateMnemonic();
            }
            await createWallet(newMnemonic);
            return;
        }
        navigation.navigate(goTo);
    };
    const createWallet = async mnemonic => {
        CommonLoading.show();
        dispatch(WalletAction.createWallets(mnemonic, COIN_LIST)).then(
            ({success}) => {
                if (success) {
                    dispatch(WalletAction.getAccountBalance()).then(() => {
                        dispatch(UserAction.signIn()).then(() => {
                            CommonLoading.hide();
                        });
                    });
                } else {
                    CommonLoading.hide();
                    showMessage({
                        message: t('message.error.unable_to_create_wallets'),
                        type: 'danger',
                    });
                }
            },
        );
    };
    return (
        <SafeAreaView style={{flex: 1}}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <View style={styles.header}>
                    <CommonTouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon type={Icons.Feather} name={'arrow-left'} />
                    </CommonTouchableOpacity>
                </View>
                <PinCode
                    onFail={() => {
                        console.log('Fail to auth');
                    }}
                    onSuccess={() => success()}
                    onClickButtonLockedPage={() => console.log('Quit')}
                    status={'choose'}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    header: {
        height: 48,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gradient: {
        width: '100%',
        height: '110%',
    },
});
export default SetPinCodeScreen;

import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showMessage} from 'react-native-flash-message';
import {COIN_LIST} from '@persistence/wallet/WalletConstant';
import CommonLoading from '@components/commons/CommonLoading';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {UserAction} from '@persistence/user/UserAction';
import {useDispatch} from 'react-redux';
import * as bip39 from 'bip39';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {deleteUserPinCode} from '@haskkor/react-native-pincode';
import CommonButton from '@components/commons/CommonButton';

export default function ImportScreen({}) {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const [mnemonics, setMnemonics] = React.useState('');
    const [isDisabled, setIsDisabled] = React.useState(true);
    const dispatch = useDispatch();

    const createWallet = async () => {
        const validMnemonic = bip39.validateMnemonic(mnemonics);
        if (!validMnemonic) {
            showMessage({
                message: t('message.error.mnemonic_invalid'),
                type: 'danger',
            });
            return;
        }
        CommonLoading.show();
        dispatch(WalletAction.createWallets(mnemonics, COIN_LIST)).then(
            ({success}) => {
                if (success) {
                    dispatch(UserAction.signIn()).then(() => {
                        CommonLoading.hide();
                    });
                } else {
                    showMessage({
                        message: t('message.error.unable_to_create_wallets'),
                        type: 'danger',
                    });
                }
            },
        );
    };
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}>
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    <CommonTouchableOpacity
                        onPress={async () => {
                            await deleteUserPinCode();
                            navigation.dispatch(StackActions.pop(2));
                        }}>
                        <Icon type={Icons.Feather} name={'arrow-left'} />
                    </CommonTouchableOpacity>
                </View>
                <View style={styles.topContainer}>
                    <Text style={styles.subtitle}>
                        {t('setup.import_phrase')}
                    </Text>
                    <Text style={styles.paragraph}>
                        {t('setup.paste_recovery_phrase')}
                    </Text>
                    <View style={styles.mnemonicsContainer}>
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            style={styles.mnemonicsInput}
                            onChange={value => setMnemonics(value)}
                        />
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.paragraphBottom}>
                        {t('setup.copy_in_order')}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <CommonButton
                        text={t('setup.import_wallet')}
                        onPress={async () => {
                            await createWallet();
                        }}></CommonButton>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexGrow: 1,
    },
    header: {
        height: 48,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topContainer: {
        flex: 2,
        paddingHorizontal: 20,
    },
    bottomContainer: {
        flex: 1,
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    mnemonicsContainer: {
        marginTop: 40,
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        minHeight: 130,
        justifyContent: 'center',
    },
    mnemonics: {
        textAlign: 'center',
        lineHeight: 25,
        fontSize: 19,
        letterSpacing: 1,
        fontFamily: 'RobotoSlab-Regular',
    },
    subtitle: {
        marginBottom: 10,
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Bold',
    },
    paragraph: {
        margin: 10,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Light',
    },
    paragraphBottom: {
        marginBottom: 20,
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: 'RobotoSlab-Light',
    },
    mnemonicsInput: {
        width: '100%',
        height: 130,
        fontSize: 20,
        textAlignVertical: 'top',
        fontWeight: 'bold',
    },
    buttonContainer: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

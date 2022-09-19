import React, {useEffect, useRef} from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actions-sheet';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import CommonButton from '@components/commons/CommonButton';
import {showMessage} from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';

export default function SettingScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {mnemonic} = useSelector(state => state.WalletReducer);
    const actionSheetRef = useRef();
    useEffect(() => {
        (async () => {})();
    }, []);
    const deleteWallet = async () => {
        Alert.alert(
            t('settings.delete_wallets'),
            t('settings.alert_delete_wallets'),
            [
                {
                    text: t('settings.cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: t('settings.yes'),
                    onPress: async () => {},
                },
            ],
        );
    };
    const copyToClipboard = () => {
        Clipboard.setString(mnemonic);
        showMessage({
            message: t('message.success.mnemonic_copied'),
            type: 'success',
        });
        actionSheetRef.current?.setModalVisible(false);
    };
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <CommonText style={styles.title}>
                    {t('settings.wallet').toUpperCase()}
                </CommonText>
                <CommonTouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        actionSheetRef.current?.setModalVisible();
                    }}>
                    <View style={styles.leftSubItem}>
                        <Icon name="key" size={20} type={Icons.Ionicons} />
                    </View>
                    <View style={styles.centerSubItem}>
                        <CommonText style={styles.textItem}>
                            {t('settings.backup_phrase')}
                        </CommonText>
                    </View>
                    <View style={styles.rightSubItem}>
                        <Icon
                            name="arrow-forward"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                </CommonTouchableOpacity>
                <CommonTouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        navigation.navigate('LanguageScreen');
                    }}>
                    <View style={styles.leftSubItem}>
                        <Icon name="language" size={20} type={Icons.Ionicons} />
                    </View>
                    <View style={styles.centerSubItem}>
                        <CommonText style={styles.textItem}>
                            {t('settings.change_language')}
                        </CommonText>
                    </View>
                    <View style={styles.rightSubItem}>
                        <Icon
                            name="arrow-forward"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                </CommonTouchableOpacity>
                <CommonTouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        navigation.navigate('ConfirmPinCodeScreen');
                    }}>
                    <View style={styles.leftSubItem}>
                        <Icon
                            name="lock-closed"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                    <View style={styles.centerSubItem}>
                        <CommonText style={styles.textItem}>
                            {t('settings.change_pincode')}
                        </CommonText>
                    </View>
                    <View style={styles.rightSubItem}>
                        <Icon
                            name="arrow-forward"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                </CommonTouchableOpacity>
                <CommonText style={styles.title}>
                    {t('settings.about').toUpperCase()}
                </CommonText>
                <CommonTouchableOpacity style={styles.item}>
                    <View style={styles.leftSubItem}>
                        <Icon
                            name="document-text"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                    <View style={styles.centerSubItem}>
                        <CommonText style={styles.textItem}>
                            {t('settings.privacy_and_policy')}
                        </CommonText>
                    </View>
                    <View style={styles.rightSubItem}>
                        <Icon
                            name="arrow-forward"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                </CommonTouchableOpacity>
                <CommonTouchableOpacity style={styles.item}>
                    <View style={styles.leftSubItem}>
                        <Icon
                            name="document-text"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                    <View style={styles.centerSubItem}>
                        <CommonText style={styles.textItem}>
                            {t('settings.terms_of_services')}
                        </CommonText>
                    </View>
                    <View style={styles.rightSubItem}>
                        <Icon
                            name="arrow-forward"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                </CommonTouchableOpacity>
                <CommonTouchableOpacity style={styles.item}>
                    <View style={styles.leftSubItem}>
                        <Icon name="link" size={20} type={Icons.Ionicons} />
                    </View>
                    <View style={styles.centerSubItem}>
                        <CommonText style={styles.textItem}>
                            {t('settings.website')}
                        </CommonText>
                    </View>
                    <View style={styles.rightSubItem}>
                        <Icon
                            name="arrow-forward"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                </CommonTouchableOpacity>
                <CommonTouchableOpacity style={styles.item}>
                    <View style={styles.leftSubItem}>
                        <Icon
                            name="logo-twitter"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                    <View style={styles.centerSubItem}>
                        <CommonText style={styles.textItem}>
                            {t('settings.twitter')}
                        </CommonText>
                    </View>
                    <View style={styles.rightSubItem}>
                        <Icon
                            name="arrow-forward"
                            size={20}
                            type={Icons.Ionicons}
                        />
                    </View>
                </CommonTouchableOpacity>
                <CommonText style={styles.title}>
                    {t('settings.version')}: 1.0.0
                </CommonText>
                <View style={styles.itemDeleteContainer}>
                    <CommonTouchableOpacity
                        style={styles.itemDelete}
                        onPress={async () => {
                            await deleteWallet();
                        }}>
                        <Icon
                            name="trash-bin"
                            size={23}
                            color="white"
                            type={Icons.Ionicons}
                        />
                        <CommonText style={styles.textDelete}>
                            {t('settings.delete_wallets')}
                        </CommonText>
                    </CommonTouchableOpacity>
                </View>

                <ActionSheet
                    ref={actionSheetRef}
                    gestureEnabled={true}
                    headerAlwaysVisible
                    containerStyle={{
                        flex: 1,
                        backgroundColor: theme.gradientPrimary,
                    }}>
                    <CommonText style={styles.recoveryText}>
                        {t('setup.your_recovery_phrase')}
                    </CommonText>
                    <View style={styles.mnemonicsContainer}>
                        <CommonText selectable style={styles.mnemonics}>
                            {mnemonic}
                        </CommonText>
                    </View>
                    <CommonText style={styles.paragraph}>
                        {t('setup.copy_these_words')}
                    </CommonText>
                    <View style={styles.button}>
                        <CommonButton
                            text={t('setup.copy')}
                            onPress={() => {
                                copyToClipboard();
                            }}
                        />
                    </View>
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
    title: {
        fontSize: 13,
        marginLeft: 10,
        marginVertical: 5,
    },
    item: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 50,
        borderBottomWidth: 0.5,
    },
    leftSubItem: {width: 20},
    rightSubItem: {},
    centerSubItem: {flex: 1},
    textItem: {marginLeft: 15},
    itemDelete: {
        backgroundColor: '#c7122a',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
        width: '90%',
    },
    itemDeleteContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textDelete: {marginLeft: 10, color: 'white', flex: 3, fontWeight: 'bold'},
    recoveryText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 15,
    },
    mnemonicsContainer: {
        marginTop: 40,
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'red',
        minHeight: 130,
        marginHorizontal: 30,
        justifyContent: 'center',
    },
    mnemonics: {
        textAlign: 'center',
        lineHeight: 25,
        fontSize: 17,
        letterSpacing: 1,
    },
    paragraph: {
        textAlign: 'center',
        marginVertical: 20,
        marginHorizontal: 40,
        fontSize: 14,
    },
    button: {
        paddingHorizontal: 10,
    },
});

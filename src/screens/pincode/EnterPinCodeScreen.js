import React, {useEffect} from 'react';
import {PinCode} from '@components/PinCode';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {UserAction} from '@persistence/user/UserAction';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {useNavigation} from '@react-navigation/native';
import CommonLoading from '@components/commons/CommonLoading';
import LinearGradient from 'react-native-linear-gradient';

const EnterPinCodeScreen = () => {
    const dispatch = useDispatch();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {loggedIn} = useSelector(state => state.UserReducer);
    const navigation = useNavigation();
    useEffect(() => {}, []);

    const success = async () => {
        CommonLoading.show();
        dispatch(WalletAction.getWallets()).then(() => {
            dispatch(WalletAction.getAccountBalance()).then(() => {});
            dispatch(UserAction.signIn()).then(() => {
                CommonLoading.hide();
            });
        });
    };

    return (
        <View style={{flex: 1}}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                {loggedIn && (
                    <View style={styles.header}>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}>
                            <Icon type={Icons.Feather} name={'arrow-left'} />
                        </CommonTouchableOpacity>
                    </View>
                )}
                <PinCode onSuccess={() => success()} status={'enter'} />
            </LinearGradient>
        </View>
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
export default EnterPinCodeScreen;

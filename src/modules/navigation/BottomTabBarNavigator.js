import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useRef} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '@components/icons/Icons';
import HomeScreen from '@screens/home/HomeScreen';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import ColorUtil from '@src/utils/ColorUtil';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';
import WalletScreen from '@screens/wallet/WalletScreen';

const TabArr = [
    {
        route: 'HomeScreen',
        label: 'Home',
        type: Icons.Feather,
        icon: 'home',
        component: HomeScreen,
        color: ColorUtil.black,
        alphaClr: ColorUtil.primaryAlpha,
    },
    {
        route: 'WalletScreen',
        label: 'Wallet',
        type: Icons.Feather,
        icon: 'credit-card',
        component: WalletScreen,
        color: ColorUtil.black,
        alphaClr: ColorUtil.greenAlpha,
    },
    {
        route: 'Add',
        label: 'Add New',
        type: Icons.Feather,
        icon: 'plus-square',
        component: WalletScreen,
        color: ColorUtil.black,
        alphaClr: ColorUtil.redAlpha,
    },
    {
        route: 'Account',
        label: 'Account',
        type: Icons.FontAwesome,
        icon: 'user-circle-o',
        component: WalletScreen,
        color: ColorUtil.black,
        alphaClr: ColorUtil.purpleAlpha,
    },
];

const Tab = createBottomTabNavigator();

const TabButton = props => {
    const {item, onPress, accessibilityState} = props;
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);
    const textViewRef = useRef(null);
    const {theme} = useSelector(state => state.ThemeReducer);
    useEffect(() => {
        if (focused) {
            // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
            viewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
            textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
        } else {
            viewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
            textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
        }
    }, [focused]);

    return (
        <CommonTouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.container, {flex: focused ? 1 : 0.65}]}>
            <View>
                <Animatable.View
                    ref={viewRef}
                    style={[
                        StyleSheet.absoluteFillObject,
                        {backgroundColor: item.color, borderRadius: 16},
                    ]}
                />
                <View style={[styles.btn]}>
                    <Icon
                        type={item.type}
                        name={item.icon}
                        color={focused ? theme.background : theme.black}
                    />
                    <Animatable.View ref={textViewRef}>
                        {focused && (
                            <CommonText
                                style={{
                                    color: theme.background,
                                    paddingHorizontal: 8,
                                }}>
                                {item.label}
                            </CommonText>
                        )}
                    </Animatable.View>
                </View>
            </View>
        </CommonTouchableOpacity>
    );
};

export default function BottomTabBarNavigator() {
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    paddingVertical: 0,
                    height: Platform.OS === 'android' ? 55 : 90,
                    backgroundColor: theme.background,
                },
            }}>
            {TabArr.map((item, index) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarShowLabel: false,
                            tabBarButton: props => (
                                <TabButton {...props} item={item} />
                            ),
                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
    },
});
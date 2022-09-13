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
import SwapScreen from '@screens/swap/SwapScreen';
import MarketScreen from '@screens/market/MarketScreen';

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
        route: 'MarketScreen',
        label: 'Market',
        type: Icons.Feather,
        icon: 'bar-chart',
        component: MarketScreen,
        color: ColorUtil.black,
        alphaClr: ColorUtil.greenAlpha,
    },
    {
        route: 'Add',
        label: 'Add New',
        type: Icons.Feather,
        icon: 'plus-square',
        component: SwapScreen,
        color: ColorUtil.black,
        alphaClr: ColorUtil.redAlpha,
    },
    {
        route: 'Account',
        label: 'Account',
        type: Icons.FontAwesome,
        icon: 'user-circle-o',
        component: SwapScreen,
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
                        {
                            backgroundColor: '#9dcdfa',
                            opacity: 0.2,
                            borderRadius: 16,
                        },
                    ]}
                />
                <View style={[styles.btn]}>
                    <Icon
                        type={item.type}
                        name={item.icon}
                        color={focused ? theme.text : theme.black}
                        size={18}
                    />
                    <Animatable.View ref={textViewRef}>
                        {focused && (
                            <CommonText
                                style={{
                                    color: theme.text,
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
                    backgroundColor: theme.gradientSecondary,
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
        flex: 1,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
    },
});

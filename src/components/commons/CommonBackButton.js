import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

export default function CommonBackButton({...rest}) {
    const {label, labelStyle, style, color} = {...rest};
    const {theme} = useSelector(state => state.ThemeReducer);
    let c = theme.textColor;
    if (color) {
        c = color;
    }
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            {...rest}></TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: 'white',
        fontSize: 16,
        lineHeight: 22,
    },
});

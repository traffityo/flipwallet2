import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Icon, {Icons} from '@components/icons/Icons';

export default function CommonBackButton({...rest}) {
    const {style, color} = {...rest};
    const {theme} = useSelector(state => state.ThemeReducer);
    let c = theme.textColor;
    if (color) {
        c = color;
    }
    return (
        <TouchableOpacity style={[styles.container, style]} {...rest}>
            <Icon type={Icons.Feather} size={18} name={'chevron-left'} />
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: 'white',
        fontSize: 16,
        lineHeight: 22,
    },
});

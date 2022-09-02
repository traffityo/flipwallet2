import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

function CommonText({style, ...rest}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {children} = {...rest};
    return (
        <Text {...rest} style={[styles.font, {color: theme.black}, style]}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    font: {
        fontFamily: 'RobotoSlab-Medium',
    },
});
export default CommonText;

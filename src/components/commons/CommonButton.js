import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';

export default function CommonButton(props) {
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <TouchableOpacity
            {...props}
            onPress={() => (props.onPress ? props.onPress() : null)}
            style={[styles.buttonContainer, {backgroundColor: theme.button}]}>
            <CommonText
                style={[
                    styles.text,
                    {color: props.disabled ? 'gray' : theme.text},
                ]}>
                {props.text}
            </CommonText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5383ec',
        borderRadius: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});

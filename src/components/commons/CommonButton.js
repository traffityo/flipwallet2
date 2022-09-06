import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';

export default function CommonButton(props) {
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <>
            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.button},
                ]}></View>
            <TouchableOpacity
                {...props}
                onPress={() => (props.onPress ? props.onPress() : null)}
                style={styles.buttonContainer}>
                <CommonText
                    style={[
                        styles.text,
                        {color: props.disabled ? 'gray' : theme.text},
                    ]}>
                    {props.text}
                </CommonText>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 64,
        backgroundColor: '#9dcdfa',
        opacity: 0.5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        marginLeft: 10,
        shadowColor: '#9dcdfa',
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,

        elevation: 18,
    },
    buttonContainer: {
        width: '100%',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

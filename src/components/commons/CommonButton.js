import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';

export default function CommonButton(props) {
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <TouchableOpacity
            {...props}
            style={[
                styles.bigBtn,
                {borderColor: theme.foreground},
                {backgroundColor: props.backgroundColor},
            ]}
            onPress={() => props.onPress()}>
            <CommonText
                style={[
                    styles.bigBtnText,
                    {color: props.disabled ? 'gray' : props.color},
                ]}>
                {props.text}
            </CommonText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    bigBtn: {
        borderWidth: 0.5,
        padding: 15,
        borderRadius: 30,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 5,
        minWidth: 250,
    },
    bigBtnText: {
        fontSize: 20,
        fontFamily: 'RobotoSlab-Bold',
        textAlign: 'center',
    },
});

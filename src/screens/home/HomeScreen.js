import React from 'react';
import {StyleSheet, View} from 'react-native';
import Wallet from '@components/Wallet';

export default function HomeScreen() {
    return (
        <View style={{height: 300}}>
            <Wallet />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

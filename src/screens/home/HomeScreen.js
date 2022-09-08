import React from 'react';
import {StyleSheet} from 'react-native';
import Wallet from '@components/Wallet';

export default function HomeScreen() {
    return <Wallet />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

function HeaderBackground({children}) {
    return (
        <View style={styles.headerBackground}>
            <View style={styles.headerCircle1}></View>
            <View style={styles.headerCircle2}></View>
            <View style={styles.headerCircle3}></View>
            <View style={styles.headerCircle4}></View>
            {children}
        </View>
    );
}

export default HeaderBackground;
const styles = StyleSheet.create({
    headerBackground: {
        backgroundColor: '#26A17B',
        height: 200,
        width: '100%',
        position: 'absolute',
    },
    headerCircle1: {
        height: 300,
        width: 300,
        borderRadius: 2200,
        backgroundColor: `rgba(255, 255, 255, 0.2)`,
        right: -150,
        top: -100,
        position: 'absolute',
    },
    headerCircle2: {
        height: 200,
        width: 200,
        borderRadius: 2200,
        backgroundColor: `rgba(255, 255, 255, 0.1)`,
        right: -100,
        top: -70,
        position: 'absolute',
    },
    headerCircle3: {
        height: 200,
        width: 200,
        borderRadius: 2200,
        backgroundColor: `rgba(255, 255, 255, 0.1)`,
        left: -120,
        top: -120,
        position: 'absolute',
    },
    headerCircle4: {
        height: 50,
        width: 50,
        borderRadius: 2200,
        backgroundColor: `rgba(255, 255, 255, 0.1)`,
        left: 50,
        top: 50,
        position: 'absolute',
    },
});

import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {useBackHandler} from '@react-native-community/hooks';
import CommonText from '@components/commons/CommonText';
import CommonLoading from '@components/commons/CommonLoading';
import {applicationProperties} from '@src/application.properties';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';

export default function WalletTransactionDetailScreen({navigation, route}) {
    const {item} = route.params;
    const webview = useRef();
    const [canGoBack, setCanGoBack] = useState(false);
    useBackHandler(() => {
        if (canGoBack) {
            webview.current.goBack();
        } else {
            navigation.goBack();
        }
        return true;
    });
    useEffect(() => {
        CommonLoading.show();
    }, []);

    const onNavigationStateChange = webViewState => {
        setCanGoBack(webViewState.canGoBack);
    };
    return (
        <SafeAreaView style={[styles.container]}>
            <View style={styles.header}>
                <CommonTouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Icon type={Icons.Feather} name={'arrow-left'} />
                </CommonTouchableOpacity>
                <CommonText style={styles.headerTitle}></CommonText>
            </View>
            <View style={styles.content}>
                <WebView
                    ref={webview}
                    source={{
                        uri: `${applicationProperties.endPoints.bsc}tx/${item.hash}`,
                    }}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={true}
                    showsVerticalScrollIndicator={false}
                    onLoad={syntheticEvent => {
                        CommonLoading.hide();
                    }}
                    onNavigationStateChange={onNavigationStateChange}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 10,
        flexDirection: 'row',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: 4,
    },
    content: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
    },
    drawer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 50,
        height: '100%',
    },
});

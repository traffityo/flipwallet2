import React, {memo, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    StyleSheet,
    View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonImage from '@components/commons/CommonImage';

let DoorClose = false;

function EntrySlide() {
    const [show, setShow] = useState(false);
    const [running, setRunning] = useState(false);
    const [title, setTitle] = useState(null);
    const [body, setBody] = useState(null);
    const {theme} = useSelector(state => state.ThemeReducer);
    const tc = useRef(null);
    const bc = useRef(null);
    useEffect(() => {
        const showListener = DeviceEventEmitter.addListener(
            'showDoor',
            message => {
                if (DoorClose) {
                    return;
                }
                DoorClose = true;
                if (message && message.title) {
                    setTitle(message.title);
                }
                if (message && message.body) {
                    setBody(message.body);
                }
                setShow(true);
                setRunning(true);
            },
        );
        const hideListener = DeviceEventEmitter.addListener('hideDoor', () => {
            if (!DoorClose) {
                return;
            }
            DoorClose = false;
            setShow(false);
            try {
                //@ts-ignore
                tc.current.bounceInDown();
                //@ts-ignore
                bc.current.bounceInUp().then(endState => {
                    if (endState.finished) {
                        setRunning(false);
                        setTitle(null);
                        setBody(null);
                    }
                });
            } catch (error) {}
        });
        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    if (!running && !show) {
        return null;
    } else {
        return (
            <View style={styles.container}>
                <Animatable.View
                    ref={tc}
                    delay={100}
                    useNativeDriver
                    animation="bounceInDown"
                    direction={show ? 'normal' : 'reverse'}
                    style={styles.animContainer}>
                    <View>
                        <CommonImage
                            style={styles.logo}
                            resizeMode="contain"
                            source={require('@assets/logo.png')}
                        />
                    </View>
                    <Svg
                        viewBox="0 0 400 150"
                        preserveAspectRatio="none"
                        style={[
                            styles.waves2,
                            {transform: [{rotate: '180deg'}]},
                        ]}>
                        <Path
                            d="M0 49.98c149.99 100.02 349.2-59.96 500 0V150H0z"
                            fill={'#1c1b1b'}
                            opacity="0.9"
                        />
                    </Svg>
                    <Svg
                        viewBox="0 0 400 150"
                        preserveAspectRatio="none"
                        style={[
                            styles.waves,
                            {transform: [{rotate: '180deg'}]},
                        ]}>
                        <Path
                            d="M0 25.98c149.99 100.02 349.2-59.96 500 0V150H0z"
                            fill={theme.door}
                            // opacity="0.7"
                        />
                    </Svg>
                </Animatable.View>
                <Animatable.View
                    ref={bc}
                    delay={100}
                    animation="bounceInUp"
                    useNativeDriver
                    direction={show ? 'normal' : 'reverse'}
                    style={styles.animview}>
                    <View style={styles.animbody}>
                        <ActivityIndicator size="small" color="#e0e0e0" />
                        {title ? (
                            <CommonText style={styles.title}>
                                {title}
                            </CommonText>
                        ) : null}
                        {body ? (
                            <CommonText style={styles.body}>{body}</CommonText>
                        ) : null}
                    </View>
                    <Svg
                        viewBox="0 0 400 150"
                        preserveAspectRatio="none"
                        style={styles.waves}>
                        <Path
                            d="M0 79.298c9.199 40.02 449.2-99.96 500 0V150H0z"
                            fill={'#1c1b1b'}
                            // opacity="0.5"
                        />
                    </Svg>
                    <Svg
                        viewBox="0 0 400 150"
                        preserveAspectRatio="none"
                        style={styles.waves2}>
                        <Path
                            d="M0 79.298c9.199 40.02 449.2-99.96 500 0V150H0z"
                            fill={theme.door}
                            // opacity="0.7"
                        />
                    </Svg>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    waves: {
        height: '100%',
        width: '150%',
        margin: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: -5,
    },
    waves2: {
        height: '98%',
        width: '160%',
        margin: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: -5,
    },
    animContainer: {
        height: '100%',
        marginTop: -60,
    },
    title: {
        color: '#d4cfcf',
        fontSize: 19,
        textAlign: 'center',
        fontWeight: '500',
        marginTop: 20,
    },
    body: {
        color: '#aba4a4',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 20,
    },
    animview: {
        width: '100%',
        height: '110%',
        position: 'absolute',
        bottom: -80,
        transform: [{scaleX: 1}],
    },
    animbody: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'center',
        marginBottom: 150,
        marginHorizontal: 40,
    },
    logo: {
        height: 70,
        width: 70,
        tintColor: 'white',
        zIndex: 100,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 200,
        opacity: 0.8,
    },
    topContainer: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    subtitle: {
        fontFamily: 'RobotoSlab-Regular',
        fontSize: 13,
    },
});
export default memo(EntrySlide);

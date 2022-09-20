import React, {Component} from 'react';
import {View} from 'react-native';
import Lottie from 'lottie-react-native';
import CommonImage from '@components/commons/CommonImage';

class CommonLoading extends Component {
    static _ref = null;

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    static setRef(ref = {}) {
        this._ref = ref;
    }

    static getRef() {
        return this._ref;
    }

    static clearRef() {
        this._ref = null;
    }

    static show() {
        this._ref.show();
    }

    static hide() {
        this._ref.hide();
    }

    _setState(reducer) {
        return new Promise(resolve => this.setState(reducer, () => resolve()));
    }

    show() {
        this._setState({show: true});
    }

    hide() {
        this._setState({show: false});
    }

    render() {
        const {show} = this.state;
        if (show) {
            return (
                <View
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <CommonImage
                        source={require('@assets/logo.png')}
                        style={{width: 16, height: 16, position: 'absolute'}}
                    />
                    <Lottie
                        source={require('@assets/json/loading.json')}
                        autoPlay
                        loop
                        style={{width: 96, height: 96}}
                    />
                </View>
            );
        }
        return <></>;
    }
}

export default CommonLoading;

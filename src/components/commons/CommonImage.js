import React from 'react';
import FastImage from 'react-native-fast-image';

export default function CommonImage({...rest}) {
    return (
        <FastImage
            resizeMode={'contain'}
            {...rest}
            onLoad={e => {}}
            onError={({nativeEvent: {error}}) => {}}
        />
    );
}

import PINCode from '@haskkor/react-native-pincode';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

export function PinCode(props) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <PINCode
            onFail={props.onFail}
            finishProcess={props.onSuccess}
            status={props.status}
            onClickButtonLockedPage={() => {
                if (props.onClickButtonLockedPage) {
                    props.onClickButtonLockedPage();
                }
            }}
            touchIDDisabled={true}
            colorCircleButtons={theme.darker}
            stylePinCodeDeleteButtonText={{color: theme.foreground}}
            colorPassword={theme.foreground}
            colorPasswordEmpty={theme.foreground}
            numbersButtonOverlayColor={theme.lighter}
            stylePinCodethemeubtitle={theme.foreground}
            stylePinCodeColorTitle={theme.foreground}
            stylePinCodeDeleteButtonthemehowUnderlay={theme.foreground}
            stylePinCodeDeleteButtonColorHideUnderlay={theme.foreground}
            stylePinCodeButtonNumber={theme.foreground}
            stylePinCodeTextButtonCircle={styles.pinCode}
            stylePinCodeTextSubtitle={styles.pinCode}
            stylePinCodeTextTitle={styles.pinCode}
            styleLockScreenButton={{transform: [{scale: 0}]}}
            buttonDeleteText={t('pincode.buttonDeleteText')}
            subtitleChoose={t('pincode.subtitleChoose')}
            subtitleError={t('pincode.subtitleError')}
            textButtonLockedPage={t('pincode.textButtonLockedPage')}
            textCancelButtonTouchID={t('pincode.textCancelButtonTouchID')}
            textDescriptionLockedPage={t('pincode.textDescriptionLockedPage')}
            textSubDescriptionLockedPage={t(
                'pincode.textSubDescriptionLockedPage',
            )}
            textTitleLockedPage={t('pincode.textTitleLockedPage')}
            titleAttemptFailed={t('pincode.titleAttemptFailed')}
            titleChoose={t('pincode.titleChoose')}
            titleConfirm={t('pincode.titleConfirm')}
            titleConfirmFailed={t('pincode.titleConfirmFailed')}
            titleEnter={t('pincode.titleEnter')}
            titleValidationFailed={t('pincode.titleValidationFailed')}
            touchIDSentence={t('pincode.touchIDSentence')}
            touchIDTitle={t('pincode.touchIDTitle')}
        />
    );
}

const styles = StyleSheet.create({
    pinCode: {
        fontWeight: '300',
    },
});

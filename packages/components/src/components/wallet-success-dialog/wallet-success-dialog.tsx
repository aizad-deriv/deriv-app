import React from 'react';
import classNames from 'classnames';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import Button from '../button';
import DesktopWrapper from '../desktop-wrapper';
import MobileDialog from '../mobile-dialog';
import MobileWrapper from '../mobile-wrapper';
import Modal from '../modal';
import Text from '../text';
import './wallet-success-dialog.scss';

type TWalletSuccessDialog = {
    description: string;
    has_cancel?: boolean;
    is_open: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    text_cancel: string;
    text_submit: string;
    title: string;
    toggleModal: () => void;
    type: 'add-wallet' | 'add-trading' | 'add-mt5';
    wallet_card: JSX.Element;
};

const WalletSuccessDialog = ({
    description,
    has_cancel = true,
    is_open,
    onCancel,
    onSubmit,
    text_cancel = 'Maybe later',
    text_submit,
    title,
    toggleModal,
    wallet_card,
}: TWalletSuccessDialog) => {
    const ModalContent = () => (
        <React.Fragment>
            <div className='wallet-success-dialog__icon'>{wallet_card}</div>
            <Text as='h2' size={isMobile() ? 'xs' : 's'} weight='bold' className='wallet-success-dialog__title'>
                {title}
            </Text>
            <Text
                as='p'
                size={isMobile() ? 'xxs' : 'xs'}
                line_height='s'
                align='center'
                className='wallet-success-dialog__description'
            >
                {description}
            </Text>
        </React.Fragment>
    );

    const ModalFooter = () => (
        <Button.Group>
            {has_cancel && (
                <Button secondary onClick={onCancel}>
                    <Localize i18n_default_text={text_cancel} />
                </Button>
            )}
            <Button primary onClick={onSubmit}>
                <Localize i18n_default_text={text_submit} />
            </Button>
        </Button.Group>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='wallet-success-dialog'
                    is_open={is_open}
                    toggleModal={toggleModal}
                    small
                    shouldCloseOnEscape
                >
                    <Modal.Body>
                        <ModalContent />
                    </Modal.Body>
                    <Modal.Footer
                        className={classNames('wallet-success-dialog__footer', {
                            'wallet-success-dialog__footer--no_cancel': !has_cancel,
                        })}
                    >
                        <ModalFooter />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    wrapper_classname='wallet-success'
                    visible={is_open}
                    onClose={toggleModal}
                    has_full_height
                >
                    <ModalContent />
                    <div className='wallet-success-dialog__footer'>
                        <ModalFooter />
                    </div>
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default WalletSuccessDialog;

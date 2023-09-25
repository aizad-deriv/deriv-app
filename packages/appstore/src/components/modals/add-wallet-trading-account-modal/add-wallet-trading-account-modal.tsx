import React from 'react';
import { useHistory } from 'react-router';
import { Button, Modal, Text, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import WalletAppCard from 'Components/wallet-app-card';
import { getAccountName } from 'Constants/utils';
import { useActiveWallet } from '@deriv/hooks';
import { useActiveWalletAccount } from '@deriv/api';
import './add-wallet-trading-account-modal.scss';

const AddWalletTradingAccountModal = observer(() => {
    const { ui, traders_hub } = useStore();
    const { is_wallet_create_new_account_modal, setWalletCreateNewAccountModal } = traders_hub;

    const { is_mobile } = ui;
    const active_wallet = useActiveWallet();
    const { data: active_wallet_account } = useActiveWalletAccount();

    const account_title = `${getAccountName({
        account_type: 'trading',
    })} (${active_wallet?.landing_company_name?.toUpperCase()})`;

    const currency_title = getAccountName({
        account_type: 'wallet',
        display_currency_code: active_wallet?.currency_config?.display_code,
    });

    const toggleWalletCreateNewAccountModal = () => {
        setWalletCreateNewAccountModal(!is_wallet_create_new_account_modal);
    };

    const wallet_details = {
        account_title,
        balance: active_wallet_account?.display_balance,
        currency_title,
        gradient_card_class: active_wallet?.gradient_card_class,
        icon: active_wallet?.icon,
        is_demo: active_wallet?.is_demo,
    };

    const history = useHistory();

    const ModalContent = () => (
        <React.Fragment>
            <div className='wallet-success-dialog__icon'>
                <WalletAppCard wallet={wallet_details} />
            </div>
            <Text as='h2' size={is_mobile ? 'xs' : 's'} weight='bold' className='wallet-success-dialog__title'>
                <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />
            </Text>
            <Text
                as='p'
                size={is_mobile ? 'xxs' : 'xs'}
                line_height='s'
                align='center'
                className='wallet-success-dialog__description'
            >
                <Localize
                    i18n_default_text='Transfer funds from your {{currency_title}} to your {{account_title}} account to start trading.'
                    values={{
                        account_title,
                        currency_title,
                    }}
                />
            </Text>
        </React.Fragment>
    );

    const ModalFooter = () => (
        <Button.Group>
            <Button secondary onClick={() => setWalletCreateNewAccountModal(false)}>
                <Localize i18n_default_text='Maybe later' />
            </Button>
            <Button
                primary
                onClick={() => {
                    setWalletCreateNewAccountModal(false);
                    history.push(routes.cashier_deposit);
                }}
            >
                <Localize i18n_default_text='Transfer funds' />
            </Button>
        </Button.Group>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='wallet-success-dialog'
                    is_open={is_wallet_create_new_account_modal}
                    toggleModal={toggleWalletCreateNewAccountModal}
                    has_close_icon={false}
                    small
                    shouldCloseOnEscape={false}
                >
                    <Modal.Body>
                        <ModalContent />
                    </Modal.Body>
                    <Modal.Footer className='wallet-success-dialog__footer'>
                        <ModalFooter />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    wrapper_classname='wallet-success'
                    visible={is_wallet_create_new_account_modal}
                    onClose={() => setWalletCreateNewAccountModal(false)}
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
});

export default AddWalletTradingAccountModal;

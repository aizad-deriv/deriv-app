import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory, withRouter } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Popover, Text, Button } from '@deriv/components';
import { routes, ContentFlag, formatMoney } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { ToggleNotifications, MenuLinks } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import { BinaryLink } from 'App/Components/Routes';
import DerivBrandLogo from 'Assets/SvgComponents/header/deriv-brand-logo.svg';
import DerivBrandLogoDark from 'Assets/SvgComponents/header/deriv-brand-logo-dark.svg';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import CurrencySelectionModal from '../../CurrencySelectionModal';
import AccountInfo from 'App/Components/Layout/Header/account-info';

const Divider = () => {
    return <div className='trading-hub-header__divider' />;
};

export const TradersHubHomeButton = ({ is_dark_mode }) => {
    const history = useHistory();
    const { pathname } = history.location;

    return (
        <div
            className={classNames('trading-hub-header__tradershub', {
                'trading-hub-header__tradershub--active': pathname === routes.traders_hub,
            })}
            onClick={() => history.push(routes.traders_hub)}
        >
            <div className='trading-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode ? 15 : 17}
                />
            </div>
            <Text className='trading-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's hub" />
            </Text>
        </div>
    );
};

const RedirectToOldInterface = ({
    setIsPreAppStore,
    should_show_exit_traders_modal,
    toggleExitTradersHubModal,
    content_flag,
    switchToCRAccount,
}) => {
    const history = useHistory();
    const disablePreAppstore = async () => {
        if (should_show_exit_traders_modal) {
            toggleExitTradersHubModal();
        } else {
            if (content_flag === ContentFlag.LOW_RISK_CR_EU) {
                await switchToCRAccount();
            }
            setIsPreAppStore(false);
            history.push(routes.root);
        }
    };
    return (
        <div className='trading-hub-header__redirect'>
            <div className='trading-hub-header__redirect--link' onClick={disablePreAppstore}>
                <Text as='p' size='xs' color='general'>
                    <Localize i18n_default_text="Exit Trader's hub" />
                </Text>
                <Icon className='trading-hub-header__redirect--beta' icon='IcAppstoreTradingHubBeta' size={50} />
                <Icon icon='IcArrowRight' size={18} color='red' />
            </div>
        </div>
    );
};

const TradingHubOnboarding = ({ is_dark_mode, setIsOnboardingVisited }) => {
    const history = useHistory();
    return (
        <div className='trading-hub-header__tradinghub--onboarding'>
            <div className='trading-hub-header__tradinghub--onboarding--logo'>
                <Popover
                    classNameBubble='account-settings-toggle__tooltip'
                    alignment='bottom'
                    message={<Localize i18n_default_text='View onboarding' />}
                    should_disable_pointer_events
                    zIndex={9999}
                >
                    <Icon
                        icon={is_dark_mode ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
                        size={20}
                        onClick={() => {
                            history.push(routes.onboarding);
                            setIsOnboardingVisited(false);
                        }}
                    />
                </Popover>
            </div>
        </div>
    );
};

const ShowNotifications = ({ is_notifications_visible, notifications_count, toggleNotifications }) => {
    return (
        <div className='trading-hub-header__notification'>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotifications}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
            />
        </div>
    );
};

const ShowAccountToggle = ({
    acc_switcher_disabled_message,
    account_type,
    balance,
    is_disabled,
    is_eu,
    is_virtual,
    currency,
    country_standpoint,
    is_dialog_on,
    toggleDialog,
}) => {
    return (
        <AccountInfo
            acc_switcher_disabled_message={acc_switcher_disabled_message}
            account_type={account_type}
            balance={balance}
            is_disabled={is_disabled}
            is_eu={is_eu}
            is_virtual={is_virtual}
            currency={currency}
            country_standpoint={country_standpoint}
            is_dialog_on={is_dialog_on}
            toggleDialog={toggleDialog}
        />
    );
};

const MemoizedMenuLinks = React.memo(MenuLinks);
const TradingHubHeader = ({
    content_flag,
    header_extension,
    is_dark_mode,
    is_eu_country,
    is_eu,
    is_logged_in,
    is_mobile,
    is_mt5_allowed,
    is_notifications_visible,
    is_pre_appstore,
    loginid,
    menu_items,
    modal_data,
    notifications_count,
    replaceCashierMenuOnclick,
    setIsOnboardingVisited,
    setIsPreAppStore,
    should_show_exit_traders_modal,
    toggleIsTourOpen,
    toggleNotifications,
    toggleExitTradersHubModal,
    switchToCRAccount,
    acc_switcher_disabled_message,
    account_type,
    balance,
    is_acc_switcher_disabled,
    is_virtual,
    currency,
    country_standpoint,
    is_acc_switcher_on,
    toggleAccountsDialog,
}) => {
    const is_mf = loginid?.startsWith('MF');
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();

    return (
        <header className='trading-hub-header'>
            <div className='trading-hub-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />

                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                {is_dark_mode ? (
                    <DerivBrandLogoDark className='trading-hub-header__logo' />
                ) : (
                    <DerivBrandLogo className='trading-hub-header__logo' />
                )}
                <DesktopWrapper>
                    <Divider />
                    <TradersHubHomeButton is_dark_mode={is_dark_mode} />
                </DesktopWrapper>
                {menu_items && is_logged_in && replaceCashierMenuOnclick()}
                <MemoizedMenuLinks
                    is_logged_in={is_logged_in}
                    is_mobile={is_mobile}
                    items={menu_items}
                    is_pre_appstore={is_pre_appstore}
                />
            </div>
            <DesktopWrapper>
                <div className='trading-hub-header__menu-right'>
                    <RedirectToOldInterface
                        setIsPreAppStore={setIsPreAppStore}
                        should_show_exit_traders_modal={should_show_exit_traders_modal}
                        toggleExitTradersHubModal={toggleExitTradersHubModal}
                        content_flag={content_flag}
                        switchToCRAccount={switchToCRAccount}
                    />
                    <Divider />
                    <div className='trading-hub-header__menu-right--items'>
                        <div className='trading-hub-header__menu-right--items--onboarding'>
                            <TradingHubOnboarding
                                is_dark_mode={is_dark_mode}
                                setIsOnboardingVisited={setIsOnboardingVisited}
                            />
                        </div>
                        <div className='trading-hub-header__menu-right--items--notifications'>
                            <ShowNotifications
                                is_notifications_visible={is_notifications_visible}
                                notifications_count={notifications_count}
                                toggleNotifications={toggleNotifications}
                            />
                        </div>
                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={9999}
                        >
                            <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                                <Icon icon='IcUserOutline' size={20} />
                            </BinaryLink>
                        </Popover>
                        <div className='trading-hub-header__menu-right--items--account-toggle'>
                            <ShowAccountToggle
                                acc_switcher_disabled_message={acc_switcher_disabled_message}
                                account_type={account_type}
                                balance={
                                    typeof balance === 'undefined' ? balance : formatMoney(currency, balance, true)
                                }
                                is_disabled={is_acc_switcher_disabled}
                                is_eu={is_eu}
                                is_virtual={is_virtual}
                                currency={currency}
                                country_standpoint={country_standpoint}
                                is_dialog_on={is_acc_switcher_on}
                                toggleDialog={toggleAccountsDialog}
                            />
                        </div>
                    </div>
                </div>
                <RealAccountSignup />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='trading-hub-header__mobile-parent'>
                    <div className='trading-hub-header__menu-middle'>
                        <div className='trading-hub-header__menu-right--items--onboarding'>
                            <TradingHubOnboarding
                                is_dark_mode={is_dark_mode}
                                toggleIsTourOpen={toggleIsTourOpen}
                                is_mf={is_mf}
                                is_eu={is_eu}
                                is_eu_country={is_eu_country}
                                setIsOnboardingVisited={setIsOnboardingVisited}
                            />
                        </div>
                        <div className='trading-hub-header__menu-right--items--notifications'>
                            <ShowNotifications
                                is_notifications_visible={is_notifications_visible}
                                notifications_count={notifications_count}
                                toggleNotifications={toggleNotifications}
                            />
                        </div>
                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={9999}
                        >
                            <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                                <Icon icon='IcUserOutline' size={20} />
                            </BinaryLink>
                        </Popover>
                    </div>
                    <div className='trading-hub-header__cashier-button'>
                        <Button primary small onClick={() => history.push(routes.cashier_deposit)}>
                            <Localize i18n_default_text='Cashier' />
                        </Button>
                    </div>
                </div>
                <RealAccountSignup />
            </MobileWrapper>
            <CurrencySelectionModal is_visible={modal_data.active_modal === 'currency_selection'} />
        </header>
    );
};

TradingHubHeader.propTypes = {
    header_extension: PropTypes.any,
    is_dark_mode: PropTypes.bool,
    is_eu_country: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_pre_appstore: PropTypes.bool,
    is_settings_modal_on: PropTypes.bool,
    loginid: PropTypes.string,
    menu_items: PropTypes.array,
    modal_data: PropTypes.object,
    notifications_count: PropTypes.number,
    replaceCashierMenuOnclick: PropTypes.func,
    setIsPreAppStore: PropTypes.func,
    setIsOnboardingVisited: PropTypes.func,
    settings_extension: PropTypes.array,
    should_show_exit_traders_modal: PropTypes.bool,
    toggleIsTourOpen: PropTypes.func,
    toggleNotifications: PropTypes.func,
    toggleExitTradersHubModal: PropTypes.func,
    content_flag: PropTypes.string,
    switchToCRAccount: PropTypes.func,
    acc_switcher_disabled_message: PropTypes.string,
    account_type: PropTypes.string,
    balance: PropTypes.any,
    currency: PropTypes.any,
    is_acc_switcher_disabled: PropTypes.any,
    country_standpoint: PropTypes.object,
    is_acc_switcher_on: PropTypes.any,
    is_virtual: PropTypes.any,
    toggleAccountsDialog: PropTypes.any,
};

export default connect(({ client, modules, notifications, ui, menu, traders_hub }) => ({
    header_extension: ui.header_extension,
    is_dark_mode: ui.is_dark_mode_on,
    is_eu_country: client.is_eu_country,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_mobile: ui.is_mobile,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    is_pre_appstore: client.is_pre_appstore,
    modal_data: traders_hub.modal_data,
    notifications_count: notifications.notifications.length,
    toggleNotifications: notifications.toggleNotificationsModal,
    loginid: client.loginid,
    menu_items: menu.extensions,
    replaceCashierMenuOnclick: modules.cashier.general_store.replaceCashierMenuOnclick,
    setIsOnboardingVisited: traders_hub.setIsOnboardingVisited,
    setIsPreAppStore: client.setIsPreAppStore,
    should_show_exit_traders_modal: traders_hub.should_show_exit_traders_modal,
    toggleIsTourOpen: traders_hub.toggleIsTourOpen,
    toggleExitTradersHubModal: ui.toggleExitTradersHubModal,
    content_flag: traders_hub.content_flag,
    switchToCRAccount: traders_hub.switchToCRAccount,
    acc_switcher_disabled_message: ui.account_switcher_disabled_message,
    account_type: client.account_type,
    balance: client.balance,
    currency: client.currency,
    is_app_disabled: ui.is_app_disabled,
    country_standpoint: client.country_standpoint,
    is_acc_switcher_on: !!ui.is_accounts_switcher_on,
    is_virtual: client.is_virtual,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(withRouter(TradingHubHeader));

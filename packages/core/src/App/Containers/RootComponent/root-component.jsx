import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useIsHubRedirectionEnabled, useOauth2 } from '@deriv/hooks';
import { moduleLoader, deriv_urls, isSafariBrowser } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const AppStore = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "appstore" */ '@deriv/appstore');
    })
);

const Wallets = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "wallets" */ '@deriv/wallets');
    })
);

const RootComponent = observer(props => {
    const { client, ui } = useStore();
    const {
        is_wallets_onboarding_tour_guide_visible,
        setIsWalletsOnboardingTourGuideVisible,
        notification_messages_ui,
    } = ui;
    const {
        has_wallet,
        logout,
        prevent_redirect_to_hub,
        is_client_store_initialized,
        prevent_single_login,
        is_logging_out,
        is_logged_in,
        setPreventSingleLogin,
    } = client;

    const { oAuthLogout } = useOauth2({ handleLogout: logout });

    const onWalletsOnboardingTourGuideCloseHandler = () => {
        setIsWalletsOnboardingTourGuideVisible(false);
    };
    const { isHubRedirectionEnabled, isHubRedirectionLoaded } = useIsHubRedirectionEnabled();

    const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub';
    const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub';

    useEffect(() => {
        setPreventSingleLogin(true);
    }, []);

    useEffect(() => {
        if (
            isHubRedirectionEnabled &&
            has_wallet &&
            !is_logging_out &&
            is_logged_in &&
            !prevent_redirect_to_hub &&
            is_client_store_initialized
        ) {
            const redirectUrl = process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;
            // NOTE: Clear OIDC related local storage, when user is in Safari browser as Safari browser doesn't support IFrame for Frontchannel logout
            if (isSafariBrowser()) {
                // NOTE: Clear OIDC related local storage, this is to prevent OIDC to re-apply client.accounts again from the callback page
                localStorage.removeItem('config.account1');
                localStorage.removeItem('config.tokens');
                // NOTE: Clear local storage to prevent user from being logged in at Deriv.app since they should be logged in at low-code Traders Hub only
                localStorage.removeItem('active_loginid');
                localStorage.removeItem('active_user_id');
                sessionStorage.removeItem('active_loginid');
                sessionStorage.removeItem('active_wallet_loginid');
                localStorage.setItem('client.accounts', '{}');
                localStorage.removeItem('active_wallet_loginid');
            }

            const redirect_to_lowcode = localStorage.getItem('redirect_to_th_os');
            localStorage.removeItem('redirect_to_th_os');
            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            const accountCurrency = url_params.get('account');

            const domain = /deriv\.(com|me|be)/.test(window.location.hostname)
                ? deriv_urls.DERIV_HOST_NAME
                : window.location.hostname;
            Cookies.set('wallet_account', true, { domain });

            switch (redirect_to_lowcode) {
                case 'wallet':
                    window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet&account=${accountCurrency}`;
                    break;
                default:
                    window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=home&account=${accountCurrency}`;
                    break;
            }
        }

        const shouldStayInDerivApp = !isHubRedirectionEnabled || !has_wallet || prevent_redirect_to_hub;
        if (prevent_single_login && isHubRedirectionLoaded && is_client_store_initialized && shouldStayInDerivApp) {
            setPreventSingleLogin(false);
        }
    }, [
        isHubRedirectionLoaded,
        isHubRedirectionEnabled,
        has_wallet,
        is_logging_out,
        is_logged_in,
        prevent_redirect_to_hub,
        prevent_single_login,
        is_client_store_initialized,
    ]);

    return has_wallet ? (
        <Wallets
            isWalletsOnboardingTourGuideVisible={is_wallets_onboarding_tour_guide_visible}
            logout={async () => {
                await oAuthLogout();
            }}
            notificationMessagesUi={notification_messages_ui}
            onWalletsOnboardingTourGuideCloseHandler={onWalletsOnboardingTourGuideCloseHandler}
            isHubRedirectionEnabled={isHubRedirectionEnabled}
        />
    ) : (
        <AppStore {...props} />
    );
});

export default RootComponent;

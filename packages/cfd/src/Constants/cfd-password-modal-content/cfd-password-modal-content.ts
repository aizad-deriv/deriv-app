import { CFD_PLATFORMS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TCategory } from '../../types/cfd-store.types';

type TGetSuccessModalSubmitLabel = {
    category: TCategory;
    platform: string;
    is_selected_mt5_verified: boolean;
};

export const getSuccessModalSubmitLabel = ({
    category,
    platform,
    is_selected_mt5_verified,
}: TGetSuccessModalSubmitLabel) => {
    if (category === 'real') {
        if (platform === CFD_PLATFORMS.MT5) {
            return is_selected_mt5_verified ? localize('Transfer now') : localize('OK');
        }
        return localize('Transfer now');
    }
    return localize('Continue');
};

// TODO: Update with other platforms and CFDs
export const getWalletAccountTitle = (type: string) => {
    switch (type) {
        case 'synthetic':
            return 'MT5 Derived';
            break;
        case 'all':
            return localize('MT5 SwapFree');
            break;
        case 'financial':
            return localize('MT5 Financial');
            break;
        default:
            return '';
    }
};

// TODO: Update with other platform and CFDs
export const getWalletCFDIcon = (type: string) => {
    switch (type) {
        case 'synthetic':
            return 'IcRebrandingDmt5Dashboard';
            break;
        case 'all':
            return 'IcRebrandingMt5SwapFree';
            break;
        case 'financial':
            return 'IcRebrandingMt5FinancialDashboard';
            break;
        default:
            return '';
    }
};

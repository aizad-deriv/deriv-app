import { CFD_PLATFORMS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TDxCompanies, getDxCompanies } from '../../Stores/Modules/CFD/Helpers/cfd-config';
import { TCategory, TType } from '../../types/cfd-store.types';

export const getAccountTitle = (
    platform: string,
    account_type: {
        category?: TCategory;
        type?: TType;
    },
    account_title: string
) => {
    if (platform === CFD_PLATFORMS.DXTRADE) {
        return getDxCompanies()[account_type.category as keyof TDxCompanies][
            account_type.type as keyof TDxCompanies['demo' | 'real']
        ].short_title;
    }

    return account_title;
};

export const getButtonLabel = (error_type?: string) => {
    if (error_type === 'PasswordReset') {
        return localize('Try later');
    }
    return localize('Add account');
};

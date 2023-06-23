import React from 'react';
import { TWalletInfo } from 'Types';
import { Text, WalletCard } from '@deriv/components';
import { useCurrencyConfig } from '@deriv/hooks';
import wallet_description_mapper from 'Constants/wallet_description_mapper';

type TAddWalletCard = {
    wallet_info: React.PropsWithChildren<TWalletInfo>;
};

const AddWalletCard = ({ wallet_info }: TAddWalletCard) => {
    const { currency, landing_company_name, is_added } = wallet_info;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);

    const wallet_details = {
        currency,
        icon: currency_config?.icon,
        icon_type: 'app',
        jurisdiction_title: landing_company_name?.toUpperCase(),
        name: currency_config?.name,
    };

    return (
        <div className='add-wallets__card'>
            <div className='add-wallets__card-wrapper'>
                <WalletCard wallet={wallet_details} size='medium' state={is_added ? 'added' : 'add'} />
                <div className='add-wallets__card-description'>
                    <Text as='h3' weight='bold' className='add-wallets__card-description__header'>
                        {`${currency_config?.display_code} Wallet`}
                    </Text>
                    <Text as='p' size='xs' className='add-wallets__card-description__text'>
                        {wallet_description_mapper[currency]}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default AddWalletCard;

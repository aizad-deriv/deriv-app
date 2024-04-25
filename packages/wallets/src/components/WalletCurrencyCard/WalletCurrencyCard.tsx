import React, { ComponentProps } from 'react';
import { THooks } from '../../types';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletCurrencyCard.scss';

type TProps = {
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    isDemo?: ComponentProps<typeof WalletGradientBackground>['isDemo'];
    size: ComponentProps<typeof WalletCurrencyIcon>['size'];
};

const WalletCurrencyCard: React.FC<TProps> = ({ currency, isDemo, size = 'md' }: TProps) => (
    <WalletGradientBackground currency={currency} isDemo={isDemo} type='card'>
        <div className={`wallets-currency-card wallets-currency-card--${size}`}>
            <WalletCurrencyIcon currency={isDemo ? 'DEMO' : currency} size={size} />
        </div>
    </WalletGradientBackground>
);

export default WalletCurrencyCard;

import React from 'react';
import { APIProvider } from '@deriv/api';
import { screen, render } from '@testing-library/react';
import AddWalletCard from '../wallet-add-card';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            { account_category: 'wallet', landing_company_name: 'svg', is_virtual: 0, currency: 'USD' },
                        ],
                        landing_company_name: 'svg',
                    },
                },
            };
        }

        if (name === 'get_account_types') {
            return {
                data: {
                    get_account_types: {
                        wallet: {
                            crypto: {
                                currencies: ['BTC'],
                            },
                            doughflow: {
                                currencies: ['USD'],
                            },
                        },
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('AddWalletCard', () => {
    it('should render currency card', () => {
        render(
            <APIProvider>
                <AddWalletCard wallet_info={{ currency: 'BTC', is_added: false, landing_company_name: 'svg' }} />
            </APIProvider>
        );

        const add_btn = screen.getByRole('button', { name: /Add/i });
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        expect(screen.getByText('SVG')).toBeInTheDocument();
        expect(add_btn).toBeInTheDocument();
        expect(add_btn).toBeEnabled();
        expect(
            screen.getByText(
                "Deposit and withdraw Bitcoin, the world's most popular cryptocurrency, hosted on the Bitcoin blockchain."
            )
        ).toBeInTheDocument();
    });

    it('should disabled button when it is disabled', () => {
        render(
            <APIProvider>
                <AddWalletCard wallet_info={{ currency: 'BTC', is_added: true, landing_company_name: 'svg' }} />
            </APIProvider>
        );

        const added_btn = screen.getByRole('button', { name: /Added/i });
        expect(added_btn).toBeInTheDocument();
        expect(added_btn).toBeDisabled();
    });
});

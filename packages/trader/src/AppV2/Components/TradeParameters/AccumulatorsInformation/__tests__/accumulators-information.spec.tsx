import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import AccumulatorsInformation from '../accumulators-information';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';

describe('AccumulatorsInformation', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        currency: 'USD',
                        maximum_payout: 4000,
                    },
                },
            }))
    );

    const mockAccumulatorsInformation = (props?: React.ComponentProps<typeof AccumulatorsInformation>) =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <AccumulatorsInformation {...props} />
                </ModulesProvider>
            </TraderProviders>
        );
    it('should not render if description is not passed', () => {
        const { container } = mockAccumulatorsInformation({ is_minimized: true });

        expect(container).toBeEmptyDOMElement();
    });

    it('should render description that is provided', () => {
        mockAccumulatorsInformation();

        expect(screen.getByText('Max. payout')).toBeInTheDocument();
        expect(screen.getByText('4,000.00 USD')).toBeInTheDocument();
    });
});

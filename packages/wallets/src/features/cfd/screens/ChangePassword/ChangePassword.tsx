import React from 'react';
import { ModalStepWrapper, Tab, Tabs } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { PlatformDetails } from '../../constants';
import MT5ChangeInvestorPasswordScreens from './InvestorPassword/MT5ChangeInvestorPasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';
import './ChangePassword.scss';

const ChangePassword = () => {
    const { getModalState } = useModal();
    const platform = getModalState('platform') ?? PlatformDetails.mt5.platform;
    const platformTitle = PlatformDetails[platform].title;

    const isDerivX = platform === PlatformDetails.dxtrade.platform;

    return (
        <ModalStepWrapper title={`Manage ${platformTitle} password`}>
            <div className='wallets-change-password__modal-wrapper'>
                <div className='wallets-change-password__container'>
                    {isDerivX ? (
                        <TradingPlatformChangePasswordScreens platform={platform} platformTitle={platformTitle} />
                    ) : (
                        <Tabs wrapperClassName='wallets-change-password__tab'>
                            <Tab title={`${platformTitle} Password`}>
                                <TradingPlatformChangePasswordScreens
                                    platform={platform}
                                    platformTitle={platformTitle}
                                />
                            </Tab>
                            <Tab title='Investor Password'>
                                <MT5ChangeInvestorPasswordScreens />
                            </Tab>
                        </Tabs>
                    )}
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default ChangePassword;

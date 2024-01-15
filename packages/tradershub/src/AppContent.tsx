import React from 'react';
import { useIsEuRegion } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { Router } from './routes';

const EuDisclaimerMessage = () => (
    <div className='absolute w-full bottom-50 bg-system-light-secondary-background'>
        <div className='max-w-[1232px] mx-auto px-500 lg:px-50'>
            <Text className='w-full text-[10px] sm:text-75 leading-[1.5] py-500'>
                <span className='font-bold'>EU statutory disclaimer</span>: CFDs are complex instruments and come with a
                high risk of losing money rapidly due to leverage.
                <span className='font-bold'>
                    70.1% of retail investor accounts lose money when trading CFDs with this provider
                </span>
                . You should consider whether you understand how CFDs work and whether you can afford to take the high
                risk of losing your money.
            </Text>
        </div>
    </div>
);

const AppContent = () => {
    const { isEU } = useIsEuRegion();

    return (
        <div className='h-full-mobile lg:h-full-desktop'>
            <div className='font-sans max-w-[1232px] mx-auto lg:pt-2500 lg:px-50'>
                <div className='z-10' id='v2_modal_show_header_root' />
                <Router />
            </div>
            {isEU && <EuDisclaimerMessage />}
        </div>
    );
};

export default AppContent;

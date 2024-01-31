import React from 'react';
import { APIProvider } from '@deriv/api';
import { Provider } from '@deriv/library';
import { BreakpointProvider } from '@deriv/quill-design';
import AppContent from './AppContent';
import { UIProvider } from './components';
import './index.scss';

const App = () => (
    <UIProvider>
        <APIProvider standalone>
            <BreakpointProvider>
                <Provider.CFDProvider>
                    <Provider.ModalProvider>
                        <AppContent />
                    </Provider.ModalProvider>
                </Provider.CFDProvider>
            </BreakpointProvider>
        </APIProvider>
    </UIProvider>
);

export default App;

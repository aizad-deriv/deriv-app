import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from '../../Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

type TRoute = {
    path?: string;
    component: React.ComponentType;
    is_authenticated?: boolean;
    getTitle: () => string;
    icon_component?: string;
    routes?: TRoute[];
    default?: boolean;
};

const BinaryRoutes = (props: TBinaryRoutes) => {
    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig().map((route: TRoute) => (
                    <RouteWithSubRoutes key={route.path} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;

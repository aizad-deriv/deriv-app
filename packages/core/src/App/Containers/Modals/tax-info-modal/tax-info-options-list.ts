import { localize } from '@deriv/translations';

/**
 * Static options for No TIN Justification.
 * key: sent to API as-is (English)
 * value: displayed to user (to be wrapped in Localize except for 'other' which uses a special key)
 */
export type TJustificationOption = {
    key: string;
    value: string;
    is_other?: boolean;
};

export const NO_TIN_JUSTIFICATION_OPTIONS: TJustificationOption[] = [
    {
        key: 'I am not legally required to obtain a TIN from the specified country.',
        value: localize('I am not legally required to obtain a TIN from the specified country.'),
    },
    {
        key: 'I am not required to disclose a TIN under the laws of the specified country.',
        value: localize('I am not required to disclose a TIN under the laws of the specified country.'),
    },
    {
        key: 'The specified country does not issue TINs to its residents.',
        value: localize('The specified country does not issue TINs to its residents.'),
    },
    {
        key: 'other',
        value: localize('I am otherwise unable to obtain a TIN or equivalent, and will provide further explanation.'),
        is_other: true,
    },
];

export const TAX_RESIDENCE_JUSTIFICATION_OPTIONS: TJustificationOption[] = [
    {
        key: 'I am temporarily living abroad (assignment/secondment/extended stay) and expect to return',
        value: localize('I am temporarily living abroad (assignment/secondment/extended stay) and expect to return'),
    },
    {
        key: 'I recently moved and my tax residence is in transition',
        value: localize('I recently moved and my tax residence is in transition'),
    },
    {
        key: 'I am tax resident in more than one country',
        value: localize('I am tax resident in more than one country'),
    },
    {
        key: 'I live in one country but work primarily in another (cross-border/rotational work)',
        value: localize('I live in one country but work primarily in another (cross-border/rotational work)'),
    },
    {
        key: 'I am a student/trainee abroad and remain tax resident elsewhere',
        value: localize('I am a student/trainee abroad and remain tax resident elsewhere'),
    },
    {
        key: 'I am posted overseas by my employer/government and remain tax resident in my home country',
        value: localize('I am posted overseas by my employer/government and remain tax resident in my home country'),
    },
    {
        key: 'I am subject to taxation based on citizenship or similar rules (e.g., US citizen)',
        value: localize('I am subject to taxation based on citizenship or similar rules (e.g., US citizen)'),
    },
    {
        key: 'other',
        value: 'Other',
        is_other: true,
    },
];

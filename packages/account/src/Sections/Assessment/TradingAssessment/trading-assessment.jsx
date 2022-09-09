import React from 'react';
import { localize, Localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';
import { RiskToleranceWarningModal } from 'Components/trading-assessment';
import { trading_assessment_questions } from 'Configs/trading-assessment-config.js';
import {
    DesktopWrapper,
    Dropdown,
    MobileWrapper,
    SelectNative,
    Text,
    FormSubmitButton,
    Loading,
} from '@deriv/components';
import FormFooter from 'Components/form-footer';
import { isMobile, routes, WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { useHistory, withRouter } from 'react-router';
import { Formik, Form } from 'formik';

const populateData = form_data => {
    return {
        risk_tolerance: form_data.risk_tolerance,
        source_of_experience: form_data.source_of_experience,
        cfd_experience: form_data.cfd_experience,
        cfd_frequency: form_data.cfd_frequency,
        trading_experience_financial_instruments: form_data.trading_experience_financial_instruments,
        trading_frequency_financial_instruments: form_data.trading_frequency_financial_instruments,
        cfd_trading_definition: form_data.cfd_trading_definition,
        leverage_impact_trading: form_data.leverage_impact_trading,
        leverage_trading_high_risk_stop_loss: form_data.leverage_trading_high_risk_stop_loss,
        required_initial_margin: form_data.required_initial_margin,
    };
};

const TradingAssessment = ({ is_virtual, setFinancialAndTradingAssessment, setShouldShowWarningModal }) => {
    const history = useHistory();
    const [is_loading, setIsLoading] = React.useState(true);
    const [is_btn_loading, setIsBtnLoading] = React.useState(false);
    const [is_submit_success, setIsSubmitSuccess] = React.useState(false);
    const [initial_form_values, setInitialFormValues] = React.useState({});
    const [should_accept_risk, setShouldAcceptRisk] = React.useState(false);
    const [form_data, setFormData] = React.useState({});

    React.useEffect(() => {
        if (is_virtual) {
            setIsLoading(false);
            history.push(routes.personal_details);
        } else {
            WS.authorized.storage.getFinancialAssessment().then(data => {
                // set initial form data
                setInitialFormValues(() => populateData(data.get_financial_assessment));
                setIsLoading(false);
                setIsSubmitSuccess(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async values => {
        setFormData(values);
        setIsBtnLoading(false);
        setIsSubmitSuccess(true);
        if (values.risk_tolerance === 'No') {
            setShouldAcceptRisk(true);
        } else {
            setIsBtnLoading(true);
            const form_payload = {
                trading_experience_regulated: {
                    cfd_experience: values.cfd_experience,
                    cfd_frequency: values.cfd_frequency,
                    cfd_trading_definition: values.cfd_trading_definition,
                    leverage_impact_trading: values.leverage_impact_trading,
                    leverage_trading_high_risk_stop_loss: values.leverage_trading_high_risk_stop_loss,
                    required_initial_margin: values.required_initial_margin,
                    risk_tolerance: values.risk_tolerance,
                    source_of_experience: values.source_of_experience,
                    trading_experience_financial_instruments: values.trading_experience_financial_instruments,
                    trading_frequency_financial_instruments: values.trading_frequency_financial_instruments,
                },
            };
            const data = await setFinancialAndTradingAssessment(form_payload);
            const { trading_score } = data?.set_financial_assessment;
            if (trading_score === 0 && !should_accept_risk) {
                setShouldShowWarningModal(true);
            }
            WS.authorized.storage.getFinancialAssessment().then(res_data => {
                setInitialFormValues(res_data.get_financial_assessment);
            });
            setIsBtnLoading(false);
            setTimeout(() => setIsSubmitSuccess(false), 10000);
        }
    };

    const handleAcceptRisk = () => {
        handleSubmit({ ...form_data, risk_tolerance: 'Yes' });
        setShouldAcceptRisk(false);
        setIsBtnLoading(false);
        setIsSubmitSuccess(false);
    };

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (should_accept_risk) {
        return (
            <RiskToleranceWarningModal
                show_risk_modal
                title={localize('Risk Tolerance Warning')}
                button_text={localize('Yes, I understand the risk.')}
                onClick={handleAcceptRisk}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, you must confirm that you understand your capital is at risk.'
                        components={[<br key={0} />]}
                    />
                }
            />
        );
    }

    return (
        <Formik
            initialValues={initial_form_values}
            enableReinitialize
            initialTouched={false}
            onSubmit={values => {
                handleSubmit(values);
            }}
        >
            {({ values, dirty, isSubmitting, handleChange, handleBlur }) => {
                return (
                    <Form className='account-form account-form__trading-assessment'>
                        <FormBody scroll_offset={isMobile() ? '150px' : '80px'}>
                            <FormSubHeader
                                title={localize('Trading Experience')}
                                subtitle={localize('All fields are required')}
                            />
                            {trading_assessment_questions.map((item, index) => {
                                if (item.field_type === 'radio') {
                                    const form_control = item.form_control;
                                    return (
                                        <fieldset className='account-form__question' key={form_control}>
                                            <DesktopWrapper>
                                                <Text
                                                    as='h1'
                                                    color='prominent'
                                                    weight='bold'
                                                    size='xs'
                                                    className='account-form__question--text'
                                                >
                                                    {item.question_text}
                                                </Text>
                                                <Dropdown
                                                    is_align_text_left
                                                    name={form_control}
                                                    value={values[form_control]}
                                                    list={item?.answer_options}
                                                    onChange={handleChange}
                                                    handleBlur={handleBlur}
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <Text
                                                    as='h1'
                                                    color='prominent'
                                                    weight='bold'
                                                    size='xs'
                                                    line_height='xl'
                                                    className='account-form__question--text'
                                                >
                                                    {item?.question_text}
                                                </Text>
                                                <SelectNative
                                                    value={values[form_control]}
                                                    name={form_control}
                                                    list_items={item?.answer_options}
                                                    hide_placeholder={true}
                                                    onChange={e => handleChange(e)}
                                                    should_show_empty_option={false}
                                                />
                                            </MobileWrapper>
                                        </fieldset>
                                    );
                                    // eslint-disable-next-line no-else-return
                                } else {
                                    return (
                                        <React.Fragment key={index}>
                                            {item.questions.map(items => {
                                                const form_control = items.form_control;
                                                return (
                                                    <fieldset key={form_control} className='account-form__question'>
                                                        <DesktopWrapper>
                                                            <Text
                                                                as='h1'
                                                                color='prominent'
                                                                weight='bold'
                                                                size='xs'
                                                                className='account-form__question--text'
                                                            >
                                                                {items.question_text}
                                                            </Text>
                                                            <Dropdown
                                                                is_align_text_left
                                                                name={form_control}
                                                                value={values[form_control]}
                                                                list={items?.answer_options}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <Text
                                                                as='h1'
                                                                color='prominent'
                                                                weight='bold'
                                                                size='xs'
                                                                line_height='xl'
                                                                className='account-form__question--text'
                                                            >
                                                                {items?.question_text}
                                                            </Text>
                                                            <SelectNative
                                                                value={values[form_control]}
                                                                name={form_control}
                                                                list_items={items?.answer_options}
                                                                onChange={e => handleChange(e)}
                                                                should_show_empty_option={false}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                }
                            })}
                        </FormBody>
                        <FormFooter>
                            <FormSubmitButton
                                is_disabled={isSubmitting || !dirty || is_btn_loading}
                                is_loading={is_btn_loading}
                                has_effect
                                is_absolute={isMobile()}
                                is_submit_success={is_submit_success && !dirty}
                                green={is_submit_success && !dirty}
                                label={localize('Submit')}
                            />
                        </FormFooter>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default connect(({ client, ui }) => ({
    setShouldShowWarningModal: ui.setShouldShowWarningModal,
    is_virtual: client.is_virtual,
    setFinancialAndTradingAssessment: client.setFinancialAndTradingAssessment,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
    updateAccountStatus: client.updateAccountStatus,
}))(withRouter(TradingAssessment));

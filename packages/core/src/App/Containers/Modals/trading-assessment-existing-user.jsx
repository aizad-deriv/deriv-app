import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import {
    RiskToleranceWarningModal,
    TradingAssessmentForm,
    TestWarningModal,
    tradingAssessmentConfig,
} from '@deriv/account';
import TradingExperienceModal from './trading-experience-modal.jsx';

const TradingAssessmentExistingUser = ({
    updateAccountStatus,
    active_account_landing_company,
    should_show_trade_assessment_form,
    setShouldShowTradeAssessmentForm,
    setFinancialAndTradingAssessment,
    should_show_risk_tolerance_warning_modal,
    setShouldShowRiskToleranceWarningModal,
    should_show_appropriateness_test_warning_modal,
    setShouldShowAppropriatenessTestWarningModal,
    setShouldShowAssessmentCompleteModal,
    setIsTradingAssessmentForExistingUserEnabled,
}) => {
    // Get the Trading assessment questions and initial_value
    const [form_values, setFormValue] = React.useState({});
    const [assessment_questions, setAssessmentQuestions] = React.useState({});

    React.useEffect(() => {
        setIsTradingAssessmentForExistingUserEnabled(true);
        const { form_value, props } = tradingAssessmentConfig(
            { real_account_signup_target: active_account_landing_company },
            null
        );
        setFormValue(form_value);
        setAssessmentQuestions(props.assessment_questions ?? []);

        return () => setIsTradingAssessmentForExistingUserEnabled(false);
    }, []);

    const handleSubmit = async values => {
        if (values.risk_tolerance === 'No') {
            setShouldShowTradeAssessmentForm(false);
            setShouldShowRiskToleranceWarningModal(true);
        } else {
            const form_payload = {
                trading_experience_maltainvest: { ...values },
            };
            const { trading_score } = await setFinancialAndTradingAssessment(form_payload);
            await updateAccountStatus();
            setShouldShowTradeAssessmentForm(false);
            if (trading_score === 0) {
                setShouldShowAppropriatenessTestWarningModal(true);
            } else {
                setShouldShowAssessmentCompleteModal(true);
            }
        }
    };

    const handleAcceptAppropriatenessTestWarning = () => {
        setShouldShowAppropriatenessTestWarningModal(false);
        setShouldShowAssessmentCompleteModal(true);
    };

    const handleAcceptRisk = () => {
        setFormValue(prev_state => ({ ...prev_state, risk_tolerance: 'Yes' }));
        setShouldShowRiskToleranceWarningModal(false);
        setShouldShowTradeAssessmentForm(true);
    };

    if (should_show_risk_tolerance_warning_modal) {
        return (
            <RiskToleranceWarningModal
                show_risk_modal={should_show_risk_tolerance_warning_modal}
                title={localize('Risk Tolerance Warning')}
                button_text={localize('Yes, I understand the risk.')}
                onClick={handleAcceptRisk}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, you must confirm that you understand your capital is at risk'
                        components={[<br key={0} />]}
                    />
                }
            />
        );
    } else if (should_show_appropriateness_test_warning_modal) {
        return (
            <TestWarningModal
                show_risk_modal={should_show_appropriateness_test_warning_modal}
                body_content={
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='In providing our services to you, we are required to ask you for some information to assess if a given product or service is appropriate for you and whether you have the experience and knowledge to understand the risks involved.<0/><1/>'
                            components={[<br key={0} />, <br key={1} />]}
                        />
                        <Localize
                            i18n_default_text='Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs. CFD trading is risky and you could potentially lose all of your capital.<0/><0/>'
                            components={[<br key={0} />, <br key={1} />]}
                        />
                        <Localize i18n_default_text='Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the knowledge or experience to properly assess or mitigate these risks, which may be significant, including the risk of losing the entire sum you have invested' />
                    </Text>
                }
                footer_content={
                    <React.Fragment>
                        <Button
                            type='button'
                            large
                            text={localize('OK')}
                            primary
                            onClick={handleAcceptAppropriatenessTestWarning}
                        />
                    </React.Fragment>
                }
            />
        );
    } else if (should_show_trade_assessment_form) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        is_open={should_show_trade_assessment_form}
                        title={localize('Trading Experience Assessment')}
                        width='904px'
                        has_close_icon={false}
                        height='688px'
                        className='real-account-signup-modal'
                    >
                        <TradingAssessmentForm
                            assessment_questions={assessment_questions}
                            form_value={form_values}
                            onSubmit={handleSubmit}
                            class_name='trading-assessment--margin-top'
                        />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        visible={should_show_trade_assessment_form}
                        title={localize('Trading Experience Assessment')}
                        portal_element_id='modal_root'
                    >
                        <TradingAssessmentForm
                            assessment_questions={assessment_questions}
                            form_value={form_values}
                            onSubmit={handleSubmit}
                        />
                    </MobileDialog>
                </MobileWrapper>
            </React.Fragment>
        );
    }
    return <TradingExperienceModal />;
};

export default connect(({ client, ui }) => ({
    setFinancialAndTradingAssessment: client.setFinancialAndTradingAssessment,
    should_show_risk_tolerance_warning_modal: ui.should_show_risk_tolerance_warning_modal,
    setShouldShowRiskToleranceWarningModal: ui.setShouldShowRiskToleranceWarningModal,
    should_show_appropriateness_test_warning_modal: ui.should_show_appropriateness_test_warning_modal,
    setShouldShowAppropriatenessTestWarningModal: ui.setShouldShowAppropriatenessTestWarningModal,
    should_show_trade_assessment_form: ui.should_show_trade_assessment_form,
    setShouldShowTradeAssessmentForm: ui.setShouldShowTradeAssessmentForm,
    setShouldShowAssessmentCompleteModal: ui.setShouldShowAssessmentCompleteModal,
    updateAccountStatus: client.updateAccountStatus,
    setIsTradingAssessmentForExistingUserEnabled: ui.setIsTradingAssessmentForExistingUserEnabled,
    active_account_landing_company: client.active_account_landing_company,
}))(TradingAssessmentExistingUser);

import React from 'react';
import { connect } from 'Stores/connect';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const TradingExperienceModal = ({
    fetchFinancialAssessment,
    setCFDScore,
    is_trading_experience_incomplete,
    onSubmit,
    shouldShowTradingAssessmentModal,
    should_show_trading_assessment_modal,
}) => {
    React.useEffect(() => {
        const fetchFinancialScore = async () => {
            try {
                const response = await fetchFinancialAssessment();
                setCFDScore(response?.cfd_score ?? 0);
                if (response?.cfd_score === 0) shouldShowTradingAssessmentModal(true);
                else shouldShowTradingAssessmentModal(false);
            } catch (err) {
                console.log('Error: ', err);
            }
        };

        fetchFinancialScore();
    }, []);
    return (
        <Modal
            width='44rem'
            className='center-risk-modal'
            is_open={is_trading_experience_incomplete || should_show_trading_assessment_modal}
        >
            <Modal.Body>
                <Icon icon='IcCurrency-eur-check' size={95} />
                <Text as='p' size='s' align='center' weight='bold' className='verified-account__text'>
                    <Localize i18n_default_text='Trading Experience Assessment<0/>' components={[<br key={0} />]} />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize
                        i18n_default_text='As per our regulatory obligations, we are required to assess your trading knowledge and experience.<0/><0/>Please click ‘OK’ to continue'
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={localize('OK')} primary onClick={onSubmit} />
            </Modal.Footer>
        </Modal>
    );
};

export default connect(({ client, ui }) => ({
    fetchFinancialAssessment: client.fetchFinancialAssessment,
    setCFDScore: client.setCFDScore,
    cfd_score: client.cfd_score,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
    shouldShowTradingAssessmentModal: ui.shouldShowTradingAssessmentModal,
    should_show_trading_assessment_modal: ui.should_show_trading_assessment_modal,
}))(TradingExperienceModal);

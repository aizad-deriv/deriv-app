import classNames from 'classnames';
import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Modal, FormSubmitButton, Text, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';

const TradingAssessmentForm = ({
    assessment_questions,
    class_name,
    form_value,
    onSubmit,
    onCancel,
    is_header_navigation,
}) => {
    const [is_next_button_enabled, setIsNextButtonEnabled] = React.useState(false);
    const [current_question_details, setCurrentQuestion] = React.useState({
        current_question_index: 0,
        current_question: {},
    });
    const [form_data, setFormData] = React.useState({});

    const last_question_index = assessment_questions.length - 1;

    React.useEffect(() => {
        setCurrentQuestion(prevState => ({
            ...prevState,
            current_question: assessment_questions[prevState.current_question_index],
        }));
        setFormData(form_value);
    }, []);

    const displayNextPage = () => {
        if (form_data.risk_tolerance === 'No') {
            onSubmit(form_data, true, true);
        } else {
            const next_question = current_question_details.current_question_index + 1;
            if (next_question < assessment_questions.length) {
                setCurrentQuestion({
                    current_question_index: next_question,
                    current_question: assessment_questions[next_question],
                });
            }
        }
    };

    const displayPreviousPage = () => {
        const prev_question = current_question_details.current_question_index - 1;
        if (prev_question >= 0) {
            setCurrentQuestion({
                current_question_index: prev_question,
                current_question: assessment_questions[prev_question],
            });
        }
    };

    const handleOnClickNext = values => {
        if (!isAssessmentCompleted(values)) {
            displayNextPage();
        }
    };

    const handleValueSelection = (e, form_control, callBackFn) => {
        if (typeof e.persist === 'function') e.persist();
        callBackFn(form_control, e.target.value);
        setFormData(prev_form => ({ ...prev_form, [form_control]: e.target.value }));
    };

    const hideElement = condition => {
        if (condition) {
            return { visibility: 'hidden' };
        }
        return {};
    };

    const isAssessmentCompleted = answers => Object.values(answers).every(answer => Boolean(answer));

    return (
        <div className={classNames('trading-assessment', class_name)}>
            <Text as='p' color='prominent' size='xxs' className='trading-assessment__side-note'>
                <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to asses whether a given product or service is appropriate for you.' />
            </Text>
            <section className='trading-assessment__header'>
                <div className='trading-assessment__header--background'>
                    <Button
                        onClick={displayPreviousPage}
                        transparent
                        style={hideElement(
                            !is_header_navigation || current_question_details.current_question_index === 0
                        )}
                        type='button'
                    >
                        <Icon icon='IcChevronLeft' color='black' />
                    </Button>
                    <Text as='h1' color='prominent' weight='bold' size='xs'>
                        {current_question_details.current_question_index + 1} {localize('of')}{' '}
                        {assessment_questions.length}
                    </Text>
                    <Button
                        onClick={displayNextPage}
                        transparent
                        is_disabled={!is_next_button_enabled}
                        className={classNames({ 'disable-pointer': !is_next_button_enabled })}
                        style={hideElement(
                            !is_header_navigation ||
                                current_question_details.current_question_index === last_question_index
                        )}
                        type='button'
                    >
                        <Icon icon='IcChevronRight' color={is_next_button_enabled ? 'black' : 'secondary'} />
                    </Button>
                </div>
                <div className='trading-assessment__header--arrow-down' />
            </section>
            <section className='trading-assessment__form'>
                <Formik initialValues={{ ...form_value }} onSubmit={(values, action) => onSubmit(values, action)}>
                    {({ setFieldValue, values }) => {
                        const { question_text, form_control, answer_options, questions } =
                            current_question_details.current_question;

                        return (
                            <Form className='trading-assessment__form--layout'>
                                <div className='trading-assessment__form--fields'>
                                    {questions && questions.length ? (
                                        <TradingAssessmentDropdownOption
                                            item_list={questions}
                                            onChange={handleValueSelection}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            setEnableNextSection={setIsNextButtonEnabled}
                                        />
                                    ) : (
                                        <TradingAssessmentRadioOption
                                            text={question_text}
                                            list={answer_options ?? []}
                                            onChange={e => handleValueSelection(e, form_control, setFieldValue, values)}
                                            values={values}
                                            form_control={form_control}
                                            setEnableNextSection={setIsNextButtonEnabled}
                                        />
                                    )}
                                </div>
                                <Modal.Footer
                                    has_separator
                                    is_bypassed={isMobile()}
                                    className='trading-assessment__existing_btn '
                                >
                                    {is_header_navigation ? (
                                        <FormSubmitButton
                                            cancel_label={localize('Previous')}
                                            has_cancel
                                            is_disabled={!isAssessmentCompleted(values)}
                                            is_absolute={isMobile()}
                                            label={localize('Next')}
                                            onCancel={() => onCancel(values)}
                                        />
                                    ) : (
                                        <Button.Group className='trading-assessment__btn-group'>
                                            {current_question_details.current_question_index !== 0 && (
                                                <Button
                                                    has_effect
                                                    onClick={displayPreviousPage}
                                                    text={localize('Previous')}
                                                    type='button'
                                                    secondary
                                                    large
                                                    className='trading-assessment__btn-group--btn'
                                                />
                                            )}
                                            <Button
                                                has_effect
                                                is_disabled={!is_next_button_enabled}
                                                onClick={() => handleOnClickNext(values)}
                                                type={isAssessmentCompleted(values) ? 'submit' : 'button'}
                                                text={localize('Next')}
                                                large
                                                primary
                                                className='trading-assessment__btn-group--btn'
                                            />
                                        </Button.Group>
                                    )}
                                </Modal.Footer>
                            </Form>
                        );
                    }}
                </Formik>
            </section>
        </div>
    );
};

export default TradingAssessmentForm;

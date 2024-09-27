import {Field} from "formik";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from 'react-router-dom';
import * as Yup from "yup";

import styles from "../components/questionnaire/Questionnaire.module.scss";
import {emailRegExp, phoneRegExp, ROUTE_CONST} from '../constants.js';

//--------Common Utils--------//
/**
 * This function takes the route name from React Router
 * and converts it to simple, readable text.
 *
 * @param {string} route the route name coming from React Router.
 *
 * @return {string} the converted string.
 */
export const convertRouteToTitle = route => {
    switch (route) {
        case ROUTE_CONST.HOME :
            return 'Home';
        case ROUTE_CONST.MAIN :
            return 'Main';
        default:
            return route.slice(1)
                .replace('-', ' ')
                .replaceAll('_', ' ')
                .replace(/\b\w/g,
                    x => x.toUpperCase());
    }
};

/**
 * A utility function that takes a string and capitalizes the first letter of each word.
 *
 * @param {string} str the string to be converted.
 *
 * @return {string} the converted string that has each first letter of each word capitalized.
 */
export const capitalizedFirstLetter = str => str
    ?.replaceAll('-', ' ')
    ?.replaceAll('_', ' ')
    ?.replace(/\b\w/g,
        x => x.toUpperCase());

/**
 * A function that a camel cased string and converts it to title case.
 *
 * @param {string} str camel cased string.
 *
 * @return {string} string converted from camel case to title case.
 */
export const convertCamelCaseToTitleCase = str => {
    const result = str.replaceAll(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const convertToCamelCase = (value) => {
    return value.toLowerCase().replace(/\s+(.)/g, function (match, group) {
        return group.toUpperCase();
    });
}

//--------Combo Component Utils----------//
/**
 * A helper function that takes the planning and image list and
 * returns an array of the planning items and its matching image.
 *
 * @param {[{id: String, columnTitle: String, title: String, planningText: String}]} planningList - an array of planning item objects
 * @param {[{id: String, imageName: String, src: String, alt: String}]} imageList - an array of image objects
 * @return {[] | [{planning: {id: String, columnTitle: String, title: String, planningText: String}, image: {id: String, imageName: String, src: String, alt: String}}]} - an array of a planning items and its matching image object
 */
export const getPlanningImageComboArray = (planningList = [], imageList = []) => {
    return planningList.map(planningItem => {
        const isPlanningColTitleANumber = !isNaN(Number(planningItem?.columnTitle));
        const matchingImage = imageList.find(image => {
            const prefixStrippedColumnTitle = image?.imageName?.replace('planning-column-', '');

            return !isPlanningColTitleANumber
                ? planningItem?.columnTitle?.includes(prefixStrippedColumnTitle)
                : Number(planningItem?.columnTitle) === Number(prefixStrippedColumnTitle);
        });

        return ({
            planning: planningItem,
            image: matchingImage
        });
    });
}

//--------Navigation--------//
/**
 * A function that generates an array of Link objects
 * from an array of routes.
 *
 * @param {[string]} routes an array of routes (strings).
 * @param {string} linkClassName a class name for styling.
 *
 * @return {*|[]} an array of Link objects.
 */
export const generateLinks = (routes, linkClassName) =>
    routes.map(
        route => (
            <Link
                key={route}
                to={route}
                className={linkClassName}
            >
                {convertRouteToTitle(route)}
            </Link>
        )
    );

/**
 * A function that generates an array of Link objects
 * from an array of routes.  In addition to the Link objects, this
 * also adds a bullet point between each link.
 *
 * @param {[string]} routes an array of routes (strings).
 * @param {string} linkClassName a class name for styling.
 *
 * @return {*|[]} an array of Link objects.
 */
export const generateFooterNavLinks = (routes, linkClassName) =>
    routes
        .map(route =>
            <Link
                key={route}
                to={route}
                className={linkClassName}
            >
                {convertRouteToTitle(route)}
            </Link>)
        .reduce((accum, current, index) => {
            return index < routes.length - 1
                ? [...accum, current, <div key={`bullet_${index}`} className='bulletPoints'>&#x2022;</div>]
                : [...accum, current];
        }, []);

/**
 * A utility function that removes the '/' from the page name.
 *
 * @param  {string} page name of the page with a preceding '/'.
 *
 * @return {*} the modified string.
 */
export const getCurrentPage = page => {
    return page.slice(1);
};

//--------Security--------//
/**
 * A function that takes a JWT and decodes it for the UI.
 *
 * @param {{}} token the JWT token sent from the server.
 *
 * @return {any} the JSON payload.
 */
export const decodeJWT = token => {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); // Decode base64 and parse JSON
    return JSON.parse(jsonPayload);
};

//--------Form Utils--------//
export const generateYupSchema = questionnaireRes => {
    if (!questionnaireRes) return {};
    let schemaObj = {};

    for (let orderKey in questionnaireRes) {
        questionnaireRes[orderKey]?.questionList?.forEach(question => {
            let fieldSchema;

            switch (question?.type) {
                case 'tel':
                case 'phone':
                    fieldSchema = Yup.string()
                        .matches(phoneRegExp, 'Please enter a valid phone number.')
                        .max(15, 'Please keep the sub-title text to only 15 characters.');
                    break;
                case 'email':
                    fieldSchema = Yup.string()
                        .matches(emailRegExp, 'Please enter a valid email.')
                        .max(2000, 'Please keep the email text to only 2000 characters.');
                    break;
                case 'number':
                    fieldSchema = Yup.number();
                    break;
                case 'date':
                    fieldSchema = Yup.date();
                    break;
                default:
                    fieldSchema = Yup.string()
                        .max(2000, 'Please keep your text to only 2000 characters.');
                    break;
            }

            // Append the required field
            if (question?.required) {
                fieldSchema = fieldSchema.required('This field is required.');
            }

            // Append to schemaObj dynamically
            schemaObj[`${question.name}`] = fieldSchema;
        });
    }

    return Yup.object().shape(schemaObj);
};

/**
 * A function that takes in the questionnaire response and generates
 * init values for the formik form.
 *
 * @param {Object} questionnaireRes - the response from the questionnaire api call.
 *
 * @return {{}} the object of init formik form values.
 */
export const generateFormikInitValues = questionnaireRes => {
    if (!questionnaireRes) return {};

    let initValuesObj = {};

    for (let orderKey in questionnaireRes) {
        questionnaireRes[orderKey]?.questionList?.map(({name, type}) => {
                if (type === 'number') {
                    initValuesObj = {
                        ...initValuesObj,
                        [`${name}`]: undefined
                    }
                } else {
                    initValuesObj = {
                        ...initValuesObj,
                        [`${name}`]: undefined
                    }
                }
            }
        )
    }

    return initValuesObj;
};


//--------Generate Custom Form Fields--------//
export const generateFields = (formikKeys, touched, errors, isPassword = false) =>
    formikKeys
        ?.map(formikKey =>
            <Col sm={12} md={6} className='gap-0' key={formikKey}>
                <Container key={formikKey}>
                    <label
                        htmlFor={`${formikKey}`}
                        id={`${formikKey}`}
                    >
                        {convertCamelCaseToTitleCase(formikKey)}
                    </label>

                    <Row>
                        <Field
                            type={isPassword ? 'password' : 'input'}
                            name={`${formikKey}`}
                            className='form_input'
                            aria-labelledby={`${formikKey}Label`}
                        />
                        {errors[`${formikKey}`] && touched[`${formikKey}`] ? (
                            <div className='u-error-text'>{errors[`${formikKey}`]}</div>
                        ) : null}
                    </Row>
                </Container>
            </Col>
        );

//--------Generate Form Fields for the Questionnaire--------//
const generateTextArea = (question, errors, touched) => (
    <Col
        className="gap-0"
        sm={12}
        lg={{span: 6}}
        key={question?.name}
    >
        <Container>
            <label
                htmlFor={question?.name}
                id={`${question?.name}Label`}
            >
                {question?.question}
            </label>

            <Row>
                <Field
                    as={question?.type}
                    name={question?.name}
                    className={styles.questions_form_section_textarea}
                    aria-labelledby={`${question?.name}Label`}
                />
                {errors[`${question?.name}`] && touched[`${question?.name}`] ? (
                    <div className='u-error-text'>
                        {errors[`${question?.name}`]}
                    </div>
                ) : null}

            </Row>
        </Container>
    </Col>
);
const generateRadio = (question, errors, touched) => (
    <Col
        className="gap-0"
        sm={12}
        lg={{span: 6}}
        key={question?.name}
    >
        <label
            htmlFor={question?.name}
            id={`${question?.name}Label`}
        >
            {question?.question}
        </label>

        <Row role="group" aria-labelledby={`${question.name}Label`}>
            {
                question?.options?.split(',')?.map(option => (
                        <label key={option}>
                            <Field
                                type="radio"
                                name={question?.name}
                                id={question?.name}
                                value={option?.toLowerCase()}
                            />
                            {capitalizedFirstLetter(option)}
                        </label>
                    )
                )
            }
            {errors[`${question?.name}`] && touched[`${question?.name}`] ? (
                <div className='u-error-text'>
                    {errors[`${question?.name}`]}
                </div>
            ) : null}
        </Row>
    </Col>
);
const generateSelect = (question, errors, touched) => (
    <Col
        className="gap-0"
        sm={12}
        lg={{span: 6}}
        key={question?.name}
    >
        <Container>
            <label
                htmlFor={question?.name}
                id={`${question?.name}Label`}
            >
                {question?.question}
            </label>

            <Row>
                <Field
                    as={question?.type}
                    name={question?.name}
                    className={styles.questions_form_section_select}
                    aria-labelledby={`${question?.name}Label`}
                >
                    <option value={undefined}>Select an option.</option>
                    {
                        question?.options?.split(',')?.map(option => (
                                <option
                                    key={option}
                                    value={option.toLowerCase()}
                                >
                                    {capitalizedFirstLetter(option)}
                                </option>
                            )
                        )
                    }
                </Field>
                {errors[`${question?.name}`] && touched[`${question?.name}`] ? (
                    <div className='u-error-text'>
                        {errors[`${question?.name}`]}
                    </div>
                ) : null}
            </Row>
        </Container>
    </Col>
);
const generateGeneralField = (question, errors, touched) => (
    <Col
        className="gap-0"
        sm={12}
        lg={{span: 6}}
        key={question?.name}
    >
        <Container>
            <label
                htmlFor={question?.name}
                id={`${question?.name}Label`}
            >
                {question?.question}
            </label>

            <Row>
                <Field
                    type={question?.type}
                    name={question?.name}
                    className={styles.questions_form_section_input}
                    aria-labelledby={`${question?.name}Label`}
                />
                {errors[`${question?.name}`] && touched[`${question?.name}`] ? (
                    <div className='u-error-text'>
                        {errors[`${question?.name}`]}
                    </div>
                ) : null}
            </Row>
        </Container>
    </Col>
);
export const generateFormikFields = (questionnaireRes, errors, touched) => {
    if (!questionnaireRes) return '';

    /**
     * This removes the wrapping objects.  The outermost
     * is an object that uses the section_order as the key,
     * then inside that object is another object with the section name
     * as the key.  This function removes those outer layers.
     * @returns Object[] this array contains the stripped down object that
     *                    take the shape of {sectionName: String, questionList: Object[]}
     */
    const questions =
        Object.entries(questionnaireRes)
            .map(([, sectionObject]) => sectionObject);

    return questions?.map(questionGroup => (
        <Container key={questionGroup.sectionName}>
            <h2>{questionGroup.sectionName}</h2>
            <Row>
                {
                    questionGroup?.questionList?.map(question => {
                        switch (question.type) {
                            case 'textarea':
                                return generateTextArea(question, errors, touched);
                            case 'radio':
                                return generateRadio(question, errors, touched);
                            case 'select':
                                return generateSelect(question, errors, touched);
                            default:
                                return generateGeneralField(question, errors, touched);
                        }
                    })
                }
            </Row>
        </Container>
        )
    );
};
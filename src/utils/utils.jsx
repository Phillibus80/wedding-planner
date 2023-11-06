import {emailRegExp, phoneRegExp, ROUTE_CONST} from '../constants.js';
import {Link} from 'react-router-dom';
import * as Yup from "yup";
import styles from "../routes/questionnaire/Questions.module.scss";
import {Field} from "formik";


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

export const getImageNameFromFileUpload = uploadedFile => {
    const updatedImageName = uploadedFile.name.toLowerCase().replace(' ', '-');
    return updatedImageName.substring(0, updatedImageName.lastIndexOf('.')) || updatedImageName;
};

export const capitalizedFirstLetter = str => str
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g,
        x => x.toUpperCase());

export const generateLinks = (routes, linkClassName) =>
    routes.map(
        route => (
            <li
                key={route}
            >
                <Link
                    to={route}
                    className={linkClassName}
                >
                    {convertRouteToTitle(route)}
                </Link>
            </li>
        )
    );

export const generateFooterNavLinks = (routes, linkClassName) =>
    routes.map(
        (route, index) => (
            <li
                key={route}
            >
                <Link
                    to={route}
                    className={linkClassName}
                >
                    {convertRouteToTitle(route)}
                </Link>
                {
                    index < routes.length - 1 &&
                    <div className='bulletPoints'>&#x2022;</div>
                }
            </li>
        )
    );

export const decodeJWT = token => {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); // Decode base64 and parse JSON
    return JSON.parse(jsonPayload);
}

export const generateYupSchema = questionnaireRes => {
    if (!questionnaireRes) return {};
    let schemaObj = {};

    for (let orderKey in questionnaireRes) {
        questionnaireRes[orderKey]?.questionList?.map(question => {

                if (question.required) {
                    switch (question.name) {
                        case 'phoneNumber' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .matches(phoneRegExp, 'Please enter a valid phone number.')
                                    .max(15, 'Please keep the sub-title text to only 15 characters.')
                                    .required('This field is required.')
                            };
                            break;
                        case 'phone' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .matches(phoneRegExp, 'Please enter a valid phone number.')
                                    .max(15, 'Please keep the sub-title text to only 15 characters.')
                                    .required('This field is required.')
                            };
                            break;
                        case 'email' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .matches(emailRegExp, 'Please enter a valid email.')
                                    .max(2000, 'Please keep the email text to only 2000 characters.')
                                    .required('This field is required.')
                            }
                            ;
                            break;
                        case 'numGuest' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.number().required('This field is required.')
                            };
                            break;
                        case 'approxBudget' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.number().required('This field is required.')
                            };
                            break;
                        case 'weddingDate' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.date()
                                    .required('This field is required.')
                            };
                            break;
                        default :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .max(2000, 'Please keep your text to only 2000 characters.')
                                    .required('This field is required.')
                            };
                            break;
                    }
                } else {
                    switch (question.name) {
                        case 'phoneNumber' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .matches(phoneRegExp, 'Please enter a valid phone number.')
                                    .max(15, 'Please keep the sub-title text to only 15 characters.')
                            };

                            break;
                        case 'phone' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .matches(phoneRegExp, 'Please enter a valid phone number.')
                                    .max(15, 'Please keep the sub-title text to only 15 characters.')
                            };

                            break;
                        case 'email' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .matches(emailRegExp, 'Please enter a valid email.')
                                    .max(2000, 'Please keep the email text to only 2000 characters.')
                            };

                            break;
                        case 'numGuest' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.number()
                            };
                            break;
                        case 'approxBudget' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.number()
                            };
                            break;
                        case 'weddingDate' :
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.date()
                            }
                            break;
                        default:
                            schemaObj = {
                                ...schemaObj,
                                [`${question.name}`]: Yup.string()
                                    .max(2000, 'Please keep your text to only 2000 characters.')
                            }

                            break;
                    }
                }
            }
        )
    }

    return Yup.object().shape(schemaObj);
}

export const generateFormikInitValues = questionnaireRes => {
    if (!questionnaireRes) return {};

    let initValuesObj = {};

    for (let orderKey in questionnaireRes) {
        questionnaireRes[orderKey]?.questionList?.map(({name, type}) => {
                if (type === 'number') {
                    initValuesObj = {
                        ...initValuesObj,
                        [`${name}`]: 0
                    }
                } else {
                    initValuesObj = {
                        ...initValuesObj,
                        [`${name}`]: ''
                    }
                }
            }
        )
    }

    return initValuesObj;
}

const generateGeneralField = (question, errors, touched) => (
    <div
        key={question?.name}
        className={styles.questions_form_section_wrapper}
    >
        <label
            htmlFor={question?.name}
            id={`${question?.name}Label`}
        >
            {question?.question}
        </label>

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
    </div>
);

const generateTextArea = (question, errors, touched) => (
    <div
        key={question?.name}
        className={styles.questions_form_section_wrapper}
    >
        <label
            htmlFor={question?.name}
            id={`${question?.name}Label`}
        >
            {question?.question}
        </label>

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
    </div>
);

const generateRadio = (question, errors, touched) => (
    <div
        key={question?.name}
        className={styles.questions_form_section_wrapper}
    >
        <label
            htmlFor={question?.name}
            id={`${question?.name}Label`}
        >
            {question?.question}
        </label>

        <div role="group" aria-labelledby={`${question.name}Label`}>
            {
                question?.options?.split(',')?.map(option => (
                        <label key={option}>
                            <Field
                                type="radio"
                                name={question?.name}
                                value={option?.toLowerCase()}
                            />
                            {capitalizedFirstLetter(option)}
                        </label>
                    )
                )
            }
        </div>
        {errors[`${question?.name}`] && touched[`${question?.name}`] ? (
            <div className='u-error-text'>
                {errors[`${question?.name}`]}
            </div>
        ) : null}
    </div>
);

export const generateSelect = (question, errors, touched) => (
    <div
        key={question?.name}
        className={styles.questions_form_section_wrapper}
    >
        <label
            htmlFor={question?.name}
            id={`${question?.name}Label`}
        >
            {question?.question}
        </label>

        <Field
            as={question?.type}
            name={question?.name}
            className={styles.questions_form_section_select}
            aria-labelledby={`${question?.name}Label`}
        >
            <option disabled value=''>Select an option.</option>
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
    </div>
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
            .map(([_, sectionObject]) => sectionObject);

    return questions?.map(questionGroup => (
            <div key={questionGroup.sectionName}>
                <h2>{questionGroup.sectionName}</h2>
                <div className={styles.questions_form_section}>
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
                </div>
            </div>
        )
    );
};
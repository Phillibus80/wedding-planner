export const apiURL = import.meta.env.DEV
    ? "http://172.20.0.3/api"
    : "/api";

export const ROUTE_CONST = {
    CONTACT_US_ROUTE: '/contact-us',
    HOME: '/',
    MAIN: 'main',
    LOGIN: '/login',
    ADMIN: '/admin',
    API: '/api',
    DESTIN_WEDDING_QS: '/destination_wedding_questions',
    WEDDING_QS: '/wedding_questions'
}

export const API_ROUTE_CONST = {
    SECTIONS: 'sections',
    SECTION: 'section',
    CREATE_SECTION: 'create-section',
    UPDATE_SECTION: 'update-section',
    CREATE_COMMENT: 'create-comment',
    UPDATE_COMMENT: 'update-comment',
    REMOVE_COMMENT: 'remove-comment',
    CREATE_IMAGE: 'create-image',
    UPDATE_IMAGE: 'update-image',
    REMOVE_IMAGE: 'remove-image',
    CREATE_LINK: 'create-link',
    UPDATE_LINK: 'update-link',
    REMOVE_LINK: 'remove-link',
    USERS: 'users',
    USER: 'user',
    UPDATE_USER: 'update-user',
    UPDATE_USER_PASSWORD: 'update-user-password',
    UPDATE_USER_PERMISSIONS: 'update-user-permissions',
    CREATE_USER: 'create-user',
    LOGIN: 'login',
    LOGOUT: 'logout',
    IMAGES: 'images',
    PAGE_IMAGES: 'get-home-images',
    SEND_EMAIL: 'send-email',
    GET_WHY_US_LIST: 'why-us',
    CREATE_WHY_US: 'create-why-us',
    UPDATE_WHY_US: 'update-why-us',
    REMOVE_WHY_US: 'remove-why-us',
    GET_PLANNING: 'planning',
    CREATE_PLANNING: 'create-planning',
    UPDATE_PLANNING: 'update-planning',
    REMOVE_PLANNING: 'remove-planning',
    QUESTIONNAIRE: 'questionnaire',
    CREATE_QUESTION: 'create-question',
    UPDATE_QUESTION: 'update-question',
    REMOVE_QUESTION: 'remove-question'
};

export const SECTIONS = {
    BANNER: 'banner',
    PROFILE: 'profile',
    SOCIAL_MEDIA: 'social-media',
    YOUTUBE: 'youtube',
    COMMENTS: 'comments',
    FOOTER: 'footer',
    GALLERY: 'gallery',
    PLANNING: 'planning',
    TAGLINE: 'tagline',
    WHY_US: 'why-us',
}

export const FETCH_KEYS = {
    QUERY: {
        HOME_PAGE: 'main-page',
        ADMIN: 'admin',
        GET_USER_BY_USERNAME: 'getUserByUsername',
        GET_PAGE_IMAGES: 'getPageImages',
        GET_WHY_US_LIST: 'getWhyUsList',
        GET_PLANNING: 'getPlanning',
        GET_QUESTIONNAIRE_QUESTIONS: 'getQuestionnaireQuestions'
    },
    MUTATION: {
        SEND_EMAIL: 'sendEmail',
        LOGIN: 'login',
        LOGOUT: 'logout',
        UPDATE_SECTION: 'updateSection',
        UPDATE_COMMENT: 'updateComment',
        CREATE_COMMENT: 'createComment',
        REMOVE_COMMENT: 'removeComment',
        UPDATE_LINK: 'updateLink',
        CREATE_LINK: 'createLink',
        REMOVE_LINK: 'removeLink',
        CREATE_IMAGE: 'createImage',
        UPDATE_IMAGE: 'updateImage',
        REMOVE_IMAGE: 'removeImage',
        UPDATE_USER: 'updateUser',
        UPDATE_USER_PASSWORD: 'updateUserPassword',
        REMOVE_WHY_US: 'removeWhyUs',
        UPDATE_WHY_US: 'updateWhyUs',
        CREATE_WHY_US: 'createWhyUs',
        REMOVE_PLANNING: 'removePlanning',
        UPDATE_PLANNING: 'updatePlanning',
        CREATE_PLANNING: 'createPlanning',
        UPDATE_QUESTION: 'updateQuestion',
        CREATE_QUESTION: 'createQuestion',
        REMOVE_QUESTION: 'removeQuestion'
    }
}

export const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
export const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const dateRegExp = /^(0[1-9]|[12][0-9]|3[01])(\/|-)(0[1-9]|1[1,2])(\/|-)(19|20)\d{2}$/;
export const timeRegExp = /([01]?[0-9]|2[0-3]):[0-5][0-9]([AaPp][Mm])$/;
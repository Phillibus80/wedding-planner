import axios from 'axios';

import {API_ROUTE_CONST, apiURL, ROUTE_CONST} from '../constants.js';

import {urlBuilder} from './utils.js';

// ----- Pages -----
// Main Page
export const getMainPageContent = async () =>
    axios.get(urlBuilder(apiURL));

// Contact Us
export const submitContactForm = async (postBody) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.SEND_EMAIL}`),
    postBody
);

// Admin
export const getAdminPageContent = async bearerToken =>
    axios.get(urlBuilder(apiURL, ROUTE_CONST.ADMIN),
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });

// Questionnaire
export const submitQuestionsForm = async (postBody, pageName) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.SEND_QUESTIONS}`),
    {...postBody, pageName}
);

export const getQuestionnaireQuestionsByPageName = async pageName =>
    axios.get(urlBuilder(apiURL, `/${API_ROUTE_CONST.QUESTIONNAIRE}`, [pageName]));

export const updateQuestionnaireQuestion = async (requestBody, bearerToken) =>
    axios.post(urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_QUESTION}`),
        {...requestBody},
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });

export const createQuestionnaireQuestion = async (requestBody, bearerToken) =>
    axios.post(urlBuilder(apiURL, `/${API_ROUTE_CONST.CREATE_QUESTION}`),
        {...requestBody},
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });

export const removeQuestionnaireQuestion = async (question_section, question_name, page_name, bearerToken) =>
    axios.post(urlBuilder(apiURL, `/${API_ROUTE_CONST.REMOVE_QUESTION}`),
        {
            question_section,
            question_name,
            page_name
        },
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        }
    );

// ----- Sections -----
export const getSections = async bearerToken => axios.get(
    urlBuilder(apiURL, API_ROUTE_CONST.SECTIONS),
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    });
export const createSection = async (
    sectionName,
    pageName,
    showSection,
    sectionContent,
    sectionImage,
    permissionLevel,
    bearerToken
) => axios.post(
    urlBuilder(apiURL, API_ROUTE_CONST.CREATE_SECTION),
    {
        sectionName,
        pageName,
        showSection,
        sectionContent,
        sectionImage,
        permissionLevel
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const updateSection = async (
    sectionName,
    pageName,
    title,
    subTitle,
    showSection,
    sectionContent,
    bearerToken
) =>
    axios.post(
        urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_SECTION}`),
        {
            sectionName,
            pageName,
            title,
            sub_title: subTitle,
            showSection,
            sectionContent
        },
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        }
    );


export const getSectionByPageName = async (pageName) => axios.get(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.SECTION}`, [pageName])
);

// ----- Users -----
export const getUsers = async bearerToken => axios.get(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_USER}`),
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    });

export const updateUser = async (firstName, lastName, userName, email, newUsername, bearerToken) => axios.patch(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_USER}`, [userName]),
    {
        first_name: firstName,
        last_name: lastName,
        user_name: newUsername,
        email
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const updateUserPassword = async (
    userName,
    currentPassword,
    newPassword,
    bearerToken
) => axios.patch(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_USER_PASSWORD}`, [userName]),
    {
        current_password: currentPassword,
        password: newPassword
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const updateUserPermissions = async (
    userName,
    newPermissionLevel,
    bearerToken
) => axios.patch(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_USER_PASSWORD}`, [userName]),
    {
        permissionLevel: newPermissionLevel
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const getUserByName = async (username, bearerToken) => axios.get(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.USER}`, [username]),
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

// ----- Auth -----
export const login = async (username, password) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.LOGIN}`),
    {
        username,
        password
    }
);

export const logout = async (username, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.LOGOUT}`),
    {
        username
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

// ----- Images -----
export const getImages = async () => axios.get(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.IMAGES}`)
);

export const getPageImages = async () => axios.get(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.PAGE_IMAGES}`)
);

export const createImage = async (imageName, alt, tagline, imageSource = '', uploadedFile, sectionName, bearerToken) => {
    const fd = new FormData();
    fd.append('imageFile', uploadedFile);
    const imageAsFormData = fd.get('imageFile');

    return axios(
        {
            method: 'post',
            url: urlBuilder(apiURL, `/${API_ROUTE_CONST.CREATE_IMAGE}`),
            data: {
                image_name: imageName,
                alt: alt,
                tagline: tagline,
                image_file: imageAsFormData,
                section_name: sectionName,
                image_src: imageSource
            },
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${bearerToken}`
            }
        }
    );
};

export const updateImage = async (id, imageName, src, alt, tagline, uploadedFile, bearerToken) => {
    if (!uploadedFile) {
        return axios.post(
            urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_IMAGE}`),
            {
                id,
                image_name: imageName,
                src,
                alt,
                tagline,
                image_file: null
            },
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            }
        );
    } else {
        const fd = new FormData();
        fd.append('imageFile', uploadedFile);
        const imageAsFormData = fd.get('imageFile');

        return axios(
            {
                method: 'post',
                url: urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_IMAGE}`),
                data: {
                    id: id,
                    image_name: imageName,
                    src: src,
                    alt: alt,
                    tagline: tagline,
                    image_file: imageAsFormData
                },
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': `Bearer ${bearerToken}`
                }
            }
        )
    }
}

export const removeImage = async (imageId, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.REMOVE_IMAGE}`),
    {
        image_id: imageId
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

// ----- AdminComment -----
export const createComment = async (sectionName, author, comment, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.CREATE_COMMENT}`),
    {
        author: author,
        comment: comment,
        section_name: sectionName
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);
export const updateComment = async (id, author, comment, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_COMMENT}`),
    {
        id: id,
        author: author,
        comment: comment
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const removeComment = async (commentId, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.REMOVE_COMMENT}`),
    {
        id: commentId
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

// ----- AdminLink -----

export const createLink = async (title, url, sectionName, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.CREATE_LINK}`),
    {
        title: title,
        url: url,
        section_name: sectionName
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const updateLink = async (id, title, url, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_LINK}`),
    {
        id: id,
        title: title,
        url: url
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const removeLink = async (linkId, bearerToken) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.REMOVE_LINK}`),
    {
        id: linkId
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

// ----- AdminWhyUs -----

export const getWhyUsList = async (bearerToken) => axios.get(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.GET_WHY_US_LIST}`),
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const updateWhyUsItem = async (
    id,
    title,
    why_text,
    mui_icon = '',
    iconifyIcon = '',
    bearerToken
) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_WHY_US}`),
    {
        id: id,
        title: title,
        why_text: why_text,
        mui_icon: mui_icon,
        iconify_icon: iconifyIcon
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const removeWhyUsItem = async (
    id,
    bearerToken
) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.REMOVE_WHY_US}`),
    {
        id: id
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const createWhyUsItem = async (
    sectionName,
    title,
    whyText,
    muiIcon = '',
    iconifyIcon = '',
    bearerToken
) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.CREATE_WHY_US}`),
    {
        section_name: sectionName,
        title: title,
        why_text: whyText,
        mui_icon: muiIcon,
        iconify_icon: iconifyIcon,
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

// ----- AdminPlanning -----

export const getPlanningList = async (bearerToken) => axios.get(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.GET_PLANNING}`),
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const updatePlanningItem = async (
    id,
    columnTitle,
    title,
    planningText,
    bearerToken
) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.UPDATE_PLANNING}`),
    {
        id: id,
        column_title: columnTitle,
        title: title,
        planning_text: planningText
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const removePlanningItem = async (
    id,
    bearerToken
) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.REMOVE_PLANNING}`),
    {
        id: id
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);

export const createPlanningItem = async (
    columnTitle,
    title,
    planningText,
    sectionName,
    bearerToken
) => axios.post(
    urlBuilder(apiURL, `/${API_ROUTE_CONST.CREATE_PLANNING}`),
    {
        column_title: columnTitle,
        title: title,
        planning_text: planningText,
        section_name: sectionName
    },
    {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    }
);
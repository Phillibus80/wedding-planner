import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    createComment,
    createImage,
    createLink,
    createPlanningItem,
    createQuestionnaireQuestion,
    createWhyUsItem,
    getAdminPageContent,
    getMainPageContent,
    getPageImages,
    getQuestionnaireQuestionsByPageName,
    getUserByName,
    login,
    logout,
    removeComment,
    removeImage,
    removeLink,
    removePlanningItem,
    removeQuestionnaireQuestion,
    removeWhyUsItem,
    submitContactForm,
    updateComment,
    updateImage,
    updateLink,
    updatePlanningItem,
    updateQuestionnaireQuestion,
    updateSection,
    updateUser,
    updateUserPassword,
    updateWhyUsItem
} from '../api-calls/calls.js';
import {FETCH_KEYS} from "../constants.js";

// Page Content
export const useGetMainPageContent = () =>
    useQuery({
        queryKey: [FETCH_KEYS.QUERY.HOME_PAGE],
        queryFn: getMainPageContent
    });

export const useSendEmailMutation = (setErrorsCallback, setSuccessCallback) => useMutation({
    mutationKey: [FETCH_KEYS.MUTATION.SEND_EMAIL],
    mutationFn: (contactFormData) => submitContactForm(contactFormData),
    onError: (e) => {
        setErrorsCallback({
            hasErrors: true,
            errorMessage: e?.response?.data?.message
        });
    },
    onSuccess: (data) => {
        setSuccessCallback({
            hasInfo: true,
            infoMessage: data?.data?.message
        });
    }
})

// Auth
export const useLogin = setErrorCallback => useMutation(
    {
        mutationKey: [FETCH_KEYS.MUTATION.LOGIN],
        mutationFn: async ({
                               user_name,
                               password
                           }) => login(user_name, password),
        onError: e => setErrorCallback({
            hasErrors: true,
            errorMessage: e.response.data.message
        })
    }
);

export const useLogOut = setErrorCallback => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation(
        {
            mutationKey: [FETCH_KEYS.MUTATION.LOGOUT],
            mutationFn: async user_name => logout(user_name, cachedBearerToken),
            onError: e => setErrorCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            }),
            onSuccess: async () => queryClient.clear()
        }
    );
}

export const useGetAdminPage = () => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';
    return useQuery({
        queryKey: [FETCH_KEYS.QUERY.ADMIN],
        queryFn: () => getAdminPageContent(cachedBearerToken),
        enabled: !!cachedBearerToken
    });
}

// Questionnaire Pages
export const useGetQuestionnaireQuestions = pageName => useQuery({
    queryKey: [FETCH_KEYS.QUERY.GET_QUESTIONNAIRE_QUESTIONS],
    queryFn: () => getQuestionnaireQuestionsByPageName(pageName),
    enabled: !!pageName
});

export const useUpdateQuestionnaireQuestion = (setSuccessCallback, setErrorCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_QUESTION],
        mutationFn: ({
                         sectionName,
                         questionName,
                         pageName,
                         requestBody
                     }) => updateQuestionnaireQuestion(sectionName, questionName, pageName, requestBody, cachedBearerToken),
        onSuccess: async data => {
            await queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_QUESTIONNAIRE_QUESTIONS]);

            return setSuccessCallback({
                hasInfo: true,
                infoMessage: data.data.message
            });
        },
        onError: async e => {
            await queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_QUESTIONNAIRE_QUESTIONS]);

            return setErrorCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            });
        }
    })
};

export const useCreateQuestionnaireQuestion = (setSuccessCallback, setErrorCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.CREATE_QUESTION],
        mutationFn: ({
                         requestBody
                     }) => createQuestionnaireQuestion(requestBody, cachedBearerToken),
        onSuccess: async data => {
            await queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_QUESTIONNAIRE_QUESTIONS]);

            return setSuccessCallback({
                hasInfo: true,
                infoMessage: data.data.message
            });
        },
        onError: async e => {
            await queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_QUESTIONNAIRE_QUESTIONS]);

            return setErrorCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            });
        }
    })
};

export const useRemoveQuestionnaireQuestion = (setSuccessCallback, setErrorCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.REMOVE_QUESTION],
        mutationFn: ({
                         questionSectionName,
                         questionName,
                         pageName
                     }) => removeQuestionnaireQuestion(questionSectionName, questionName, pageName, cachedBearerToken),
        onSuccess: async data => {
            setSuccessCallback({
                hasInfo: true,
                infoMessage: data.data.message
            });

            return queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_QUESTIONNAIRE_QUESTIONS]);
        },
        onError: async e => {
            await queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_QUESTIONNAIRE_QUESTIONS]);

            return setErrorCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            });
        }
    })
};

// Users
export const useGetUserByName = (username, jwtToken) => useQuery({
    queryKey: [FETCH_KEYS.QUERY.GET_USER_BY_USERNAME],
    queryFn: () => getUserByName(username, jwtToken),
    enabled: !!username && !!jwtToken
});

export const useUpdateUser = (setSuccessCallback, setErrorCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_USER],
        mutationFn: ({
                         firstName,
                         lastName,
                         userName,
                         email
                     }) => updateUser(firstName, lastName, userName, email, cachedBearerToken),
        onSuccess: async data => {
            setSuccessCallback({
                hasInfo: true,
                infoMessage: data.data.message
            });

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_USER_BY_USERNAME]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ])
        },
        onError: async e => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_USER_BY_USERNAME]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            return setErrorCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })
        }
    })
}

export const useUpdateUserPassword = (setSuccessCallback, setErrorCallback, useUserSuccess) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const bearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_USER_PASSWORD],
        mutationFn: ({
                         userName,
                         currentPassword,
                         newPassword
                     }) => updateUserPassword(userName, currentPassword, newPassword, bearerToken),
        onSuccess: async data => {
            setSuccessCallback({
                hasInfo: true,
                infoMessage: data.data.message
            });

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_USER_BY_USERNAME]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ])
        },
        onError: async e => {
            setErrorCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.GET_USER_BY_USERNAME]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        enabled: !!useUserSuccess
    })
}
// Sections
export const useUpdateSection = (setErrorsCallback, setSuccessCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_SECTION],
        mutationFn: ({
                         sectionName,
                         pageName,
                         title = '',
                         subTitle = '',
                         showSection,
                         sectionContent
                     }
        ) => updateSection(
            sectionName,
            pageName,
            title,
            subTitle,
            showSection,
            sectionContent,
            cachedBearerToken
        ),
        onSuccess: async data => {
            queryClient.removeQueries({
                queryKey: [FETCH_KEYS.QUERY.ADMIN],
                exact: true
            });

            setSuccessCallback({
                hasInfo: true,
                infoMessage: data?.data?.message
            });

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE])
            ]);
        },
        onError: async e => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            return setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })
        },
        enabled: !!cachedBearerToken
    });
}


// Comments
export const useUpdateComment = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_COMMENT],
        mutationFn: ({
                         id,
                         author,
                         comment
                     }) => updateComment(id, author, comment, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        enabled: !!cachedBearerToken
    });
}

export const useCreateComment = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.CREATE_COMMENT],
        mutationFn: ({
                         sectionName,
                         author,
                         comment
                     }) => createComment(sectionName, author, comment, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        enabled: !!cachedBearerToken
    });
}

export const useRemoveComment = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.REMOVE_COMMENT],
        mutationFn: ({commentId}) => removeComment(commentId, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        enabled: !!cachedBearerToken
    });
}

// Links
export const useUpdateLink = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_LINK],
        mutationFn: ({
                         id,
                         title,
                         url
                     }) => updateLink(id, title, url, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        enabled: !!cachedBearerToken
    });
}

export const useCreateLink = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.CREATE_LINK],
        mutationFn: ({
                         sectionName,
                         title,
                         url
                     }) => createLink(title, url, sectionName, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        enabled: !!cachedBearerToken
    });
}

export const useRemoveLink = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.REMOVE_LINK],
        mutationFn: ({linkId}) => removeLink(linkId, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        enabled: !!cachedBearerToken
    });
}

// Images
export const useGetPageImages = () => useQuery({
    queryKey: [FETCH_KEYS.QUERY.GET_PAGE_IMAGES],
    queryFn: getPageImages
});

export const useCreateImage = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.CREATE_IMAGE],
        mutationFn: ({
                         imageName,
                         alt,
                         tagline,
                         fileSrc,
                         sectionName
                     }) => createImage(imageName, alt, tagline, fileSrc, sectionName, cachedBearerToken),
        onSuccess: async data => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })
        },
        onError: async e => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })
        }
    });
}

export const useUpdateImage = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_IMAGE],
        mutationFn: ({
                         imageName,
                         src,
                         alt,
                         tagline,
                         fileSrc
                     }) => updateImage(imageName, src, alt, tagline, fileSrc, cachedBearerToken),
        onSuccess: async data => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })
        },
        onError: async e => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })
        },
        enabled: !!cachedBearerToken
    });
}

export const useRemoveImage = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.REMOVE_IMAGE],
        mutationFn: ({imageName}) => removeImage(imageName, cachedBearerToken),
        onSuccess: async data => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })
        },
        onError: async e => {
            await Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);

            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })
        },
        enabled: !!cachedBearerToken
    });
}

// Why Us
export const useCreateWhyUsItem = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.CREATE_WHY_US],
        mutationFn: ({
                         sectionName,
                         title,
                         whyText,
                         muiIcon,
                         iconifyIcon
                     }) => createWhyUsItem(
            sectionName,
            title,
            whyText,
            muiIcon,
            iconifyIcon,
            cachedBearerToken
        ),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        }
    });
}

export const useUpdateWhyUs = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_WHY_US],
        mutationFn: ({
                         id,
                         title,
                         whyText,
                         muiIcon,
                         iconifyIcon
                     }) => {
            return updateWhyUsItem(
                id,
                title,
                whyText,
                muiIcon,
                iconifyIcon,
                cachedBearerToken
            )
        },
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        }
    });
}

export const useRemoveWhyUs = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.REMOVE_WHY_US],
        mutationFn: ({id}) => removeWhyUsItem(id, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        }
    });
}

// Planning
export const useCreatePlanningItem = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.CREATE_PLANNING],
        mutationFn: ({
                         columnTitle,
                         title,
                         planningText,
                         sectionName
                     }) => createPlanningItem(
            columnTitle,
            title,
            planningText,
            sectionName,
            cachedBearerToken
        ),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: e => Promise.all(
            [
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]
        )
            .then(
                setErrorsCallback({
                    hasErrors: true,
                    errorMessage: e.response.data.message
                })
            )

    });
}

export const useUpdatePlanning = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.UPDATE_PLANNING],
        mutationFn: ({
                         id,
                         columnTitle,
                         title,
                         planningText
                     }) => {
            return updatePlanningItem(
                id,
                columnTitle,
                title,
                planningText,
                cachedBearerToken
            )
        },
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        }
    });
}

export const useRemovePlanning = (setErrorsCallback, successCallback) => {
    const queryClient = useQueryClient();
    const queryData = queryClient.getQueryData([`${FETCH_KEYS.QUERY.GET_USER_BY_USERNAME}`]);
    const cachedBearerToken = !!queryData?.data?.data?.token ? queryData.data.data.token : '';

    return useMutation({
        mutationKey: [FETCH_KEYS.MUTATION.REMOVE_PLANNING],
        mutationFn: ({id}) => removePlanningItem(id, cachedBearerToken),
        onSuccess: async data => {
            successCallback({
                hasInfo: true,
                infoMessage: data.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        },
        onError: async e => {
            setErrorsCallback({
                hasErrors: true,
                errorMessage: e.response.data.message
            })

            return Promise.all([
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.HOME_PAGE]),
                queryClient.invalidateQueries([FETCH_KEYS.QUERY.ADMIN])
            ]);
        }
    });
}
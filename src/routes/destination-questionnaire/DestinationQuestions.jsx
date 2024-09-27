import PropTypes from "prop-types";
import {useContext} from "react";
import {Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

import Questionnaire from "../../components/questionnaire/Questionnaire.jsx";
import * as styles from '../../components/questionnaire/Questionnaire.module.scss';
import CustomToast from "../../components/toast/CustomToast.jsx";
import {AdminSectionContext} from "../../context/adminSectionContext/AdminSectionContext.jsx";
import {useSendQuestionsEmailMutation} from "../../hooks/api-hooks.js";


const DestinationQuestions = ({page}) => {
    const {setErrors, setInfo} = useContext(AdminSectionContext);

    const navigate = useNavigate();
    const sendEmail = useSendQuestionsEmailMutation(setErrors, setInfo, page);
    const introText = `Congratulations on your engagement! We are thrilled that you’ve chosen Risen Rose Creations to design your perfect wedding day. Every couple is different and that means every design will be completely unique and tailored to your love story and preferences. Please answer this questionnaire with as many details as possible so that I can turn your dreams into reality.`;
    const header = 'Destination Wedding Questionnaire';
    const subHeader = 'Risen Rose Creations';

    const handleSubmit = async values => {
        sendEmail.mutate(values);
    };

    return (
        <>
            <CustomToast
                errorCallBack={() => navigate('/')}
                infoCallBack={() => navigate('/')}
            />

            <Image src={'../../../api/img/Decor-outline.webp'}
                   alt='background image'
                   role='presentation'
                   aria-hidden
                   className={styles.backgroundFlourish_1}
                   loading="lazy"
                   defer
            />
            <Image src={'../../../api/img/Decor-outline.webp'}
                   alt='background image'
                   role='presentation'
                   aria-hidden
                   className={styles.backgroundFlourish_2}
                   loading="lazy"
                   defer
            />
            <Image src={'../../../api/img/Decor.webp'}
                   alt='background image'
                   role='presentation'
                   aria-hidden
                   className={styles.backgroundFlourish_3}
                   loading="lazy"
                   defer
            />

            <Questionnaire
                page={page}
                header={header}
                subHeader={subHeader}
                introText={introText}
                submitCallback={handleSubmit}
            />
        </>
    );
};

DestinationQuestions.propTypes = {
    page: PropTypes.string
};

export default DestinationQuestions;
import PropTypes from "prop-types";
import {useState} from "react";
import {Col} from "react-bootstrap";

import {getPlanningImageComboArray} from "../../../../utils/utils.jsx";
import AdminPlanning from "../../components/adminPlanning/AdminPlanning.jsx";
import styles from '../imageList/ImageList.module.scss';

const AdminPlanningList = ({count = 0, planningList = [], imageList = []}) => {
    const [showNewPlanning, setShowNewPlanning] = useState(false);

    const comboArray = getPlanningImageComboArray(planningList, imageList);

    const handleRemovePlanning = () => setShowNewPlanning(false);
    const plannings = comboArray?.length > 0
        ? comboArray.map(element =>
            <Col className='gap-0' sm={12} md={3} key={element?.planning?.id}>
                <AdminPlanning
                    key={element?.planning?.id}
                    id={element?.planning?.id}
                    columnTitle={element?.planning?.columnTitle}
                    title={element?.planning?.title}
                    planningText={element?.planning?.planningText}
                    removeCallback={handleRemovePlanning}
                    imageId={element?.image?.id}
                    imageName={element?.image?.imageName}
                    src={element?.image?.src}
                    alt={element?.image?.alt}
                />
            </Col>)
        : [];

    const additionalPlanning =
        (!planningList?.some(({id}) => !id))
        && <Col className='gap-0' sm={12} md={3} key={`pl-${comboArray.length}`}>
            <div className={styles.button_wrapper}>
                {
                    showNewPlanning
                        ? <AdminPlanning
                            id=''
                            columanTitle=''
                            title=''
                            PlanningText=''
                            removeCallback={handleRemovePlanning}
                            imageId=''
                            imageName=''
                            src=''
                            alt=''
                        />
                        : <button className={styles.navigation__button}
                                  onClick={() => setShowNewPlanning(true)}>
                            <span className={styles.navigation__icon}>&nbsp;</span>
                        </button>
                }
            </div>
        </Col>;


    return count > 0
        ? [...plannings, additionalPlanning]
        : [additionalPlanning];
};

AdminPlanningList.propTypes = {
    count: PropTypes.number,
    imageList: PropTypes.arrayOf(PropTypes.shape({
        imageName: PropTypes.string,
        src: PropTypes.string,
        alt: PropTypes.string,
        tagline: PropTypes.string,
        priority: PropTypes.string
    })),
    planningList: PropTypes.arrayOf(PropTypes.shape({
            columnTitle: PropTypes.string,
            title: PropTypes.string,
            planningText: PropTypes.string,
            sectionName: PropTypes.string,
            id: PropTypes.string
        })
    ).isRequired
}

export default AdminPlanningList;
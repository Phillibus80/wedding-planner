import styles from './AdminPlanningList.module.scss';
import AdminPlanning from "../adminPlanning/AdminPlanning.jsx";
import PropTypes from "prop-types";

const AdminPlanningList = ({count, planningList}) => {
    return (count > 0)
        &&
        <section className={styles.planningList}>
            {
                planningList.map(({id, columnTitle, title, planningText, removeCallback}) => (
                    <AdminPlanning
                        key={title}
                        id={id}
                        columnTitle={columnTitle}
                        title={title}
                        planningText={planningText}
                        removeCallback={removeCallback}
                    />
                ))
            }
        </section>
};

AdminPlanningList.propTypes = {
    count: PropTypes.number,
    planningList: PropTypes.arrayOf(PropTypes.shape({
            columnTitle: PropTypes.string,
            title: PropTypes.string,
            planningText: PropTypes.string,
            sectionName: PropTypes.string,
            id: PropTypes.string
        })
    )
}

export default AdminPlanningList;
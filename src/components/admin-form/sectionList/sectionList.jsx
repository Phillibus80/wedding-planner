import styles from './sectionList.module.scss';
import AdminSection from "../adminSection/AdminSection.jsx";
import {Fade} from "react-awesome-reveal";

const SectionList = ({sectionArray}) => sectionArray.length > 0 && (
    <div className={styles.adminSection}>
        {
            sectionArray.map(el => {
                    return (
                        <Fade bottom distance="10%" duration={1000} key={el.sectionName}>
                            <AdminSection
                                section={el}
                            />
                        </Fade>
                    )
                }
            )
        }
    </div>
);

export default SectionList;